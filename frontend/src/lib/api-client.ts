import { getApiBaseUrl } from '@/config/env';
import { getAccessToken } from '@/lib/auth-storage';

type ApiClientOptions = RequestInit;

export async function apiClient<T>(
    endpoint: string,
    options?: ApiClientOptions,
): Promise<T> {
    const apiBaseUrl = getApiBaseUrl();
    const accessToken = getAccessToken();

    const headers = new Headers(options?.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message ?? `API request failed: ${response.status}`);
    }

    return data as T;
}