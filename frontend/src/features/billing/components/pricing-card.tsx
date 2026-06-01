'use client';

import { useState } from 'react';

import { createCheckoutSession } from '../api/billing.api';
import { BillingPlan } from '../types/billing.types';

type PricingCardProps = {
  plan: BillingPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
};

export function PricingCard({
  plan,
  name,
  price,
  description,
  features,
}: PricingCardProps) {
  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    try {
      setIsRedirecting(true);
      setError('');

      const data = await createCheckoutSession({
        plan,
        customerEmail: email || undefined,
      });

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Could not start checkout. Please try again.');
      setIsRedirecting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">{name}</h2>
      <p className="mt-2 text-slate-400">{description}</p>

      <p className="mt-6 text-4xl font-bold text-white">{price}</p>

      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-300">
          Email for checkout
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isRedirecting}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRedirecting ? 'Redirecting...' : 'Upgrade to Pro'}
      </button>
    </div>
  );
}