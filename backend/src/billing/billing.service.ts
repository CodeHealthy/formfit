import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from '../users/users.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import {
  StripeWebhookEventDocument,
  StripeWebhookEventLog,
} from './schemas/stripe-webhook-event.schema';
import {
  CheckoutSessionResponse,
  PortalSessionResponse,
} from './types/billing.types';

type StripePrice = {
  id?: string;
};

type StripeSubscriptionItem = {
  price?: StripePrice;
};

type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      customer?: string | null;
      subscription?: string | null;
      status?: string;
      current_period_start?: number;
      current_period_end?: number;
      cancel_at_period_end?: boolean;
      items?: {
        data?: StripeSubscriptionItem[];
      };
      customer_details?: {
        email?: string | null;
      };
      metadata?: Record<string, string> | null;
    };
  };
};

type StripeSubscriptionPayload = StripeWebhookEvent['data']['object'] & {
  id: string;
  customer: string;
};

const PRO_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

@Injectable()
export class BillingService {
  private readonly stripeClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
    @InjectModel(StripeWebhookEventLog.name)
    private readonly webhookEventModel: Model<StripeWebhookEventDocument>,
  ) {
    this.stripeClient = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse> {
    const user = await this.usersService.findById(userId);
    const priceId = this.getPriceIdForPlan(dto.plan);

    const successUrl = this.configService.getOrThrow<string>(
      'FRONTEND_BILLING_SUCCESS_URL',
    );

    const cancelUrl = this.configService.getOrThrow<string>(
      'FRONTEND_BILLING_CANCEL_URL',
    );

    const metadata = {
      plan: dto.plan,
      userId: user.id,
      userEmail: user.email,
    };

    const session = await this.stripeClient.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email }),
      metadata,
      subscription_data: {
        metadata,
      },
    });

    if (!session.url) {
      throw new Error('Stripe checkout session URL was not returned');
    }

    return {
      checkoutUrl: session.url,
    };
  }

  async createPortalSession(userId: string): Promise<PortalSessionResponse> {
    const user = await this.usersService.findById(userId);

    if (!user.stripeCustomerId) {
      throw new BadRequestException(
        'No Stripe customer is linked to this account yet',
      );
    }

    const returnUrl = `${this.configService.getOrThrow<string>(
      'FRONTEND_URL',
    )}/dashboard`;

    const session = await this.stripeClient.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return {
      portalUrl: session.url,
    };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): StripeWebhookEvent {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    return this.stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    ) as StripeWebhookEvent;
  }

  async handleWebhookEvent(event: StripeWebhookEvent) {
    const wasAlreadyProcessed = await this.hasProcessedWebhookEvent(event.id);

    if (wasAlreadyProcessed) {
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        await this.handleCheckoutCompleted(session);

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        await this.syncSubscription(event.data.object as StripeSubscriptionPayload);

        break;
      }

      case 'customer.subscription.deleted': {
        await this.syncSubscription(event.data.object as StripeSubscriptionPayload);

        break;
      }

      default: {
        console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    }

    await this.markWebhookEventProcessed(event);
  }

  private getPriceIdForPlan(plan: string) {
    if (plan === 'pro') {
      return this.configService.getOrThrow<string>('STRIPE_PRICE_ID_PRO');
    }

    throw new Error(`Unsupported billing plan: ${plan}`);
  }

  private async handleCheckoutCompleted(
    session: StripeWebhookEvent['data']['object'],
  ) {
    const userId = session.metadata?.userId;
    const userEmail =
      session.metadata?.userEmail ?? session.customer_details?.email ?? undefined;
    const stripeCustomerId = this.toStripeId(session.customer);
    const stripeSubscriptionId = this.toStripeId(session.subscription);

    if (!userId || !userEmail || !stripeCustomerId || !stripeSubscriptionId) {
      console.log('Skipping incomplete Stripe checkout session:', {
        sessionId: session.id,
        userId,
        userEmail,
        stripeCustomerId,
        stripeSubscriptionId,
      });
      return;
    }

    const subscription = (await this.stripeClient.subscriptions.retrieve(
      stripeSubscriptionId,
    )) as unknown as StripeSubscriptionPayload;

    await this.syncSubscription(subscription, {
      userId,
      userEmail,
      stripeCheckoutSessionId: session.id,
    });

    await this.usersService.updateBillingState(userId, {
      stripeCustomerId,
    });
  }

  private async syncSubscription(
    subscription: StripeSubscriptionPayload,
    fallback?: {
      userId?: string;
      userEmail?: string;
      stripeCheckoutSessionId?: string;
    },
  ) {
    const userId = subscription.metadata?.userId ?? fallback?.userId;
    const stripeCustomerId = this.toStripeId(subscription.customer);
    const stripeSubscriptionId = subscription.id;
    const stripePriceId = subscription.items?.data?.[0]?.price?.id;

    if (!userId || !stripeCustomerId || !stripeSubscriptionId || !stripePriceId) {
      console.log('Skipping incomplete Stripe subscription payload:', {
        subscriptionId: stripeSubscriptionId,
        userId,
        stripeCustomerId,
        stripePriceId,
      });
      return;
    }

    const user = await this.usersService.findById(userId);
    const status = subscription.status ?? 'unknown';

    await this.subscriptionsService.upsertSubscription({
      userId,
      userEmail: subscription.metadata?.userEmail ?? fallback?.userEmail ?? user.email,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeCheckoutSessionId: fallback?.stripeCheckoutSessionId,
      stripePriceId,
      plan: 'pro',
      status,
      currentPeriodStart: this.fromStripeTimestamp(
        subscription.current_period_start,
      ),
      currentPeriodEnd: this.fromStripeTimestamp(subscription.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      metadata: subscription.metadata ?? {},
    });

    await this.usersService.updateBillingState(userId, {
      plan: PRO_SUBSCRIPTION_STATUSES.has(status) ? 'pro' : 'free',
      stripeCustomerId,
    });
  }

  private fromStripeTimestamp(timestamp?: number) {
    return timestamp ? new Date(timestamp * 1000) : undefined;
  }

  private toStripeId(value?: string | { id?: string } | null) {
    if (!value) {
      return undefined;
    }

    return typeof value === 'string' ? value : value.id;
  }

  private async hasProcessedWebhookEvent(eventId: string) {
    const existingEvent = await this.webhookEventModel.exists({ eventId });

    return Boolean(existingEvent);
  }

  private async markWebhookEventProcessed(event: StripeWebhookEvent) {
    await this.webhookEventModel.updateOne(
      { eventId: event.id },
      {
        $setOnInsert: {
          eventId: event.id,
          type: event.type,
          processedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
}
