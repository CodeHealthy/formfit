import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StripeWebhookEventDocument = HydratedDocument<StripeWebhookEventLog>;

@Schema({
  timestamps: true,
})
export class StripeWebhookEventLog {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  eventId!: string;

  @Prop({
    required: true,
    index: true,
  })
  type!: string;

  @Prop({
    required: true,
  })
  processedAt!: Date;
}

export const StripeWebhookEventSchema = SchemaFactory.createForClass(
  StripeWebhookEventLog,
);
