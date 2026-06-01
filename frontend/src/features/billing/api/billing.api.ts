import { apiClient } from '@/lib/api-client';

import {
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
} from '../types/billing.types';

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload,
) {
  return apiClient<CheckoutSessionResponse>('/billing/checkout/session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}