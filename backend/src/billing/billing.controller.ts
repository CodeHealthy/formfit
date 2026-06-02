import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout/session')
  @UseGuards(JwtAuthGuard)
  createCheckoutSession(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.billingService.createCheckoutSession(user.sub, dto);
  }

  @Post('portal/session')
  @UseGuards(JwtAuthGuard)
  createPortalSession(@CurrentUser() user: JwtPayload) {
    return this.billingService.createPortalSession(user.sub);
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
