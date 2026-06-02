import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export type SubscriptionPlan = 'pro';

@Schema({
  timestamps: true,
})
export class Subscription {
  @Prop({
    required: true,
    index: true,
  })
  userId!: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  userEmail!: string;

  @Prop({
    required: true,
    index: true,
  })
  stripeCustomerId!: string;

  @Prop({
    required: true,
    unique: true,
    sparse: true,
  })
  stripeSubscriptionId!: string;

  @Prop({
    index: true,
  })
  stripeCheckoutSessionId?: string;

  @Prop({
    required: true,
  })
  stripePriceId!: string;

  @Prop({
    enum: ['pro'],
    required: true,
  })
  plan!: SubscriptionPlan;

  @Prop({
    required: true,
    index: true,
  })
  status!: string;

  @Prop()
  currentPeriodStart?: Date;

  @Prop()
  currentPeriodEnd?: Date;

  @Prop({
    default: false,
  })
  cancelAtPeriodEnd!: boolean;

  @Prop({
    type: Object,
    default: {},
  })
  metadata!: Record<string, string>;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
