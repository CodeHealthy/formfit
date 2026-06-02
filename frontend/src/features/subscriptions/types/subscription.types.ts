export type SubscriptionSummary = {
  id: string;
  plan: 'pro';
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
};

export type SubscriptionResponse = {
  subscription: SubscriptionSummary | null;
};
