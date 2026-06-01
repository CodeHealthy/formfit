import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

import type { BillingPlan } from '../types/billing.types';

export class CreateCheckoutSessionDto {
  @IsIn(['pro'])
  plan!: BillingPlan;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}