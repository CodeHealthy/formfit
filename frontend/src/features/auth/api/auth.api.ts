import { apiClient } from '@/lib/api-client';

import type {
    AuthResponse,
    AuthUser,
    LoginPayload,
    SignupPayload,
} from '../types/auth.types';

export function signup(payload: SignupPayload) {
    return apiClient<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function login(payload: LoginPayload) {
    return apiClient<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function getMe() {
    return apiClient<AuthUser>('/auth/me');
}