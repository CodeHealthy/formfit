import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Subscription,
  SubscriptionDocument,
  SubscriptionPlan,
} from './schemas/subscription.schema';

export type UpsertSubscriptionInput = {
  userId: string;
  userEmail: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeCheckoutSessionId?: string;
  stripePriceId: string;
  plan: SubscriptionPlan;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, string>;
};

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async upsertSubscription(
    input: UpsertSubscriptionInput,
  ): Promise<SubscriptionDocument> {
    return this.subscriptionModel.findOneAndUpdate(
      {
        stripeSubscriptionId: input.stripeSubscriptionId,
      },
      {
        $set: {
          userId: input.userId,
          userEmail: input.userEmail.toLowerCase(),
          stripeCustomerId: input.stripeCustomerId,
          stripeSubscriptionId: input.stripeSubscriptionId,
          stripeCheckoutSessionId: input.stripeCheckoutSessionId,
          stripePriceId: input.stripePriceId,
          plan: input.plan,
          status: input.status,
          currentPeriodStart: input.currentPeriodStart,
          currentPeriodEnd: input.currentPeriodEnd,
          cancelAtPeriodEnd: input.cancelAtPeriodEnd,
          metadata: input.metadata ?? {},
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async findLatestByUserId(
    userId: string,
  ): Promise<SubscriptionDocument | null> {
    return this.subscriptionModel.findOne({ userId }).sort({ updatedAt: -1 });
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionDocument | null> {
    return this.subscriptionModel.findOne({ stripeSubscriptionId });
  }
}
