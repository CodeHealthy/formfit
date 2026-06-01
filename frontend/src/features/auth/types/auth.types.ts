export type UserPlan = 'free' | 'pro';

export type UserRole = 'user' | 'admin';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    plan: UserPlan;
};

export type AuthResponse = {
    accessToken: string;
    user: AuthUser;
};

export type SignupPayload = {
    name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};