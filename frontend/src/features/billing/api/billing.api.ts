import { apiClient } from '@/lib/api-client';

import {
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
  PortalSessionResponse,
} from '../types/billing.types';

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload,
) {
  return apiClient<CheckoutSessionResponse>('/billing/checkout/session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createPortalSession() {
  return apiClient<PortalSessionResponse>('/billing/portal/session', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
