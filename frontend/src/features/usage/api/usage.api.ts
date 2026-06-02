import { apiClient } from '@/lib/api-client';

import type { UsageStatus } from '../types/usage.types';

export function consumeImageFix(anonymousId: string) {
  return apiClient<UsageStatus>('/usage/consume', {
    method: 'POST',
    body: JSON.stringify({ anonymousId }),
  });
}

export function getImageFixUsageStatus(anonymousId: string) {
  const searchParams = new URLSearchParams({ anonymousId });

  return apiClient<UsageStatus>(`/usage/status?${searchParams.toString()}`);
}
