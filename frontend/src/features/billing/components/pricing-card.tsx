'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createCheckoutSession } from '../api/billing.api';
import { BillingPlan } from '../types/billing.types';
import { getAccessToken } from '@/lib/auth-storage';

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
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    if (!getAccessToken()) {
      router.push('/login');
      return;
    }

    try {
      setIsRedirecting(true);
      setError('');

      const data = await createCheckoutSession({
        plan,
      });

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Could not start checkout. Please sign in and try again.');
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
