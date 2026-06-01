export type BillingPlan = 'pro';

export type CreateCheckoutSessionPayload = {
  plan: BillingPlan;
  customerEmail?: string;
  userId?: string;
};

export type CheckoutSessionResponse = {
  checkoutUrl: string;
};