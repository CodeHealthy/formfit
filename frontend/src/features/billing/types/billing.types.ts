export type BillingPlan = 'pro';

export type CreateCheckoutSessionPayload = {
  plan: BillingPlan;
};

export type CheckoutSessionResponse = {
  checkoutUrl: string;
};

export type PortalSessionResponse = {
  portalUrl: string;
};
