import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout/session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error('Missing raw body for Stripe webhook');
    }

    if (!signature) {
      throw new Error('Missing Stripe signature header');
    }

    const event = this.billingService.constructWebhookEvent(rawBody, signature);

    await this.billingService.handleWebhookEvent(event);

    return {
      received: true,
    };
  }
}