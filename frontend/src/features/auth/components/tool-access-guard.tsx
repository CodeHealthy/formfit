'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getMe } from '@/features/auth/api/auth.api';
import type { AuthUser, UserPlan } from '@/features/auth/types/auth.types';
import { getAccessToken } from '@/lib/auth-storage';

type ToolAccessGuardProps = {
  children: React.ReactNode;
  requiredPlan?: UserPlan;
  toolName: string;
};

export function ToolAccessGuard({
  children,
  requiredPlan = 'free',
  toolName,
}: ToolAccessGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }

      try {
        setUser(await getMe());
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <AccessPanel
        title="Checking access"
        description="Please wait while we verify your plan."
      />
    );
  }

  if (!user) {
    return (
      <AccessPanel
        title={`${toolName} requires an account`}
        description="Create a free account or log in to use this tool."
        primaryHref="/signup"
        primaryLabel="Create account"
        secondaryHref="/login"
        secondaryLabel="Log in"
      />
    );
  }

  if (requiredPlan === 'pro' && user.plan !== 'pro') {
    return (
      <AccessPanel
        title={`${toolName} is a Pro tool`}
        description="Upgrade to Pro to unlock FormFit's advanced PDF tools."
        primaryHref="/pricing"
        primaryLabel="View pricing"
        secondaryHref="/dashboard"
        secondaryLabel="Back to dashboard"
      />
    );
  }

  return children;
}

function AccessPanel({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">{description}</p>

      {(primaryHref || secondaryHref) && (
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {primaryHref && primaryLabel && (
            <Link
              href={primaryHref}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              {primaryLabel}
            </Link>
          )}

          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
