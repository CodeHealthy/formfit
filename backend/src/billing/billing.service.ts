import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CheckoutSessionResponse } from './types/billing.types';

type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      customer?: string | null;
      subscription?: string | null;
      status?: string;
      metadata?: Record<string, string> | null;
    };
  };
};

@Injectable()
export class BillingService {
  private readonly stripeClient;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(
    dto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse> {
    const priceId = this.getPriceIdForPlan(dto.plan);

    const successUrl = this.configService.getOrThrow<string>(
      'FRONTEND_BILLING_SUCCESS_URL',
    );

    const cancelUrl = this.configService.getOrThrow<string>(
      'FRONTEND_BILLING_CANCEL_URL',
    );

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
      customer_email: dto.customerEmail,
      metadata: {
        plan: dto.plan,
        userId: dto.userId ?? '',
      },
    });

    if (!session.url) {
      throw new Error('Stripe checkout session URL was not returned');
    }

    return {
      checkoutUrl: session.url,
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
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        console.log('Stripe checkout completed:', {
          eventId: event.id,
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          metadata: session.metadata,
        });

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        console.log('Stripe subscription event:', {
          eventId: event.id,
          type: event.type,
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        break;
      }

      default: {
        console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    }
  }

  private getPriceIdForPlan(plan: string) {
    if (plan === 'pro') {
      return this.configService.getOrThrow<string>('STRIPE_PRICE_ID_PRO');
    }

    throw new Error(`Unsupported billing plan: ${plan}`);
  }
}