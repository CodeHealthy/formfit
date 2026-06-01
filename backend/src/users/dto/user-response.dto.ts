import type { UserPlan, UserRole } from '../schemas/user.schema';

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
};