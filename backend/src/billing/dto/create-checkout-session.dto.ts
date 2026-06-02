import { IsIn } from 'class-validator';

import type { BillingPlan } from '../types/billing.types';

export class CreateCheckoutSessionDto {
  @IsIn(['pro'])
  plan!: BillingPlan;
}
