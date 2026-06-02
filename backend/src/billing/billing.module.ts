import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import {
  StripeWebhookEventLog,
  StripeWebhookEventSchema,
} from './schemas/stripe-webhook-event.schema';

@Module({
  imports: [
    UsersModule,
    SubscriptionsModule,
    MongooseModule.forFeature([
      {
        name: StripeWebhookEventLog.name,
        schema: StripeWebhookEventSchema,
      },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
