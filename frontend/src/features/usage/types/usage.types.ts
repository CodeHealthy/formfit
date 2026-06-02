export type UsagePlan = 'guest' | 'free' | 'pro';

export type UsageStatus = {
  plan: UsagePlan;
  usedToday: number;
  dailyLimit: number;
  remainingToday: number;
};
