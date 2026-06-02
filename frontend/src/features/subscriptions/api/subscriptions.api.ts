import { apiClient } from '@/lib/api-client';

import type { SubscriptionResponse } from '../types/subscription.types';

export function getMySubscription() {
  return apiClient<SubscriptionResponse>('/subscriptions/me');
}
