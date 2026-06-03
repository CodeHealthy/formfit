'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMe } from '@/features/auth/api/auth.api';
import type { AuthUser } from '@/features/auth/types/auth.types';
import { createPortalSession } from '@/features/billing/api/billing.api';
import { getMySubscription } from '@/features/subscriptions/api/subscriptions.api';
import type { SubscriptionSummary } from '@/features/subscriptions/types/subscription.types';
import { getImageFixUsageStatus } from '@/features/usage/api/usage.api';
import type { UsageStatus } from '@/features/usage/types/usage.types';
import { getAnonymousUsageId } from '@/features/usage/utils/anonymous-usage-id';
import {
    getToolAccessLabel,
    TOOL_CATALOG,
    type ToolCatalogItem,
} from '@/features/tools/constants/tool-catalog';
import { clearAccessToken } from '@/lib/auth-storage';

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionSummary | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isOpeningPortal, setIsOpeningPortal] = useState(false);
    const [portalError, setPortalError] = useState('');

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getMe();
                const [usageData, subscriptionData] = await Promise.all([
                    getImageFixUsageStatus(getAnonymousUsageId()),
                    getMySubscription(),
                ]);

                setUser(currentUser);
                setUsageStatus(usageData);
                setSubscription(subscriptionData.subscription);
            } catch {
                clearAccessToken();
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [router]);

    function handleLogout() {
        clearAccessToken();
        router.push('/');
    }

    async function handleManageBilling() {
        try {
            setIsOpeningPortal(true);
            setPortalError('');

            const session = await createPortalSession();
            window.location.href = session.portalUrl;
        } catch {
            setPortalError('Billing portal is available after a Pro checkout.');
            setIsOpeningPortal(false);
        }
    }

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-slate-400">Loading dashboard...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const availableTools = TOOL_CATALOG.filter((tool) =>
        canUseTool(tool, user.plan),
    ).length;

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
                            Back home
                        </Link>

                        <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                            Dashboard
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Welcome, {user.name}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/tools/image-fixer"
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                        >
                            Open Image Fixer
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <section className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <p className="text-sm text-slate-400">Current plan</p>
                        <p className="mt-3 text-3xl font-bold capitalize">{user.plan}</p>
                        <p className="mt-2 text-sm text-slate-400">
                            {availableTools} of {TOOL_CATALOG.length} tools available
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <p className="text-sm text-slate-400">Daily image fixes</p>
                        <p className="mt-3 text-3xl font-bold">
                            {usageStatus
                                ? `${usageStatus.usedToday}/${usageStatus.dailyLimit}`
                                : user.plan === 'pro'
                                    ? '0/200'
                            : '0/10'}
                        </p>
                        {usageStatus && (
                            <p className="mt-2 text-sm text-slate-400">
                                {usageStatus.remainingToday} remaining today
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <p className="text-sm text-slate-400">Subscription</p>
                        <p className="mt-3 text-3xl font-bold capitalize">
                            {subscription?.status ?? 'None'}
                        </p>
                        {subscription?.currentPeriodEnd && (
                            <p className="mt-2 text-sm text-slate-400">
                                Renews through {formatDate(subscription.currentPeriodEnd)}
                            </p>
                        )}
                    </div>
                </section>

                <section className="mt-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                                Tools
                            </p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight">
                                Continue from your workspace
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-slate-400">
                                Your dashboard includes the same FormFit tools as the homepage,
                                with access based on your current plan.
                            </p>
                        </div>

                        {user.plan !== 'pro' && (
                            <Link
                                href="/pricing"
                                className="rounded-xl border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10"
                            >
                                Unlock Pro tools
                            </Link>
                        )}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {TOOL_CATALOG.map((tool) => {
                            const isAvailable = canUseTool(tool, user.plan);

                            return (
                                <Link
                                    key={tool.href}
                                    href={isAvailable ? tool.href : '/pricing'}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-500/60 hover:bg-white/[0.05]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-semibold text-white">
                                            {tool.name}
                                        </h3>
                                        <span
                                            className={
                                                isAvailable
                                                    ? 'shrink-0 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs text-green-300'
                                                    : 'shrink-0 rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400'
                                            }
                                        >
                                            {isAvailable
                                                ? 'Available'
                                                : getToolAccessLabel(tool.access)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {tool.description}
                                    </p>

                                    <p className="mt-4 text-sm font-medium text-blue-300">
                                        {isAvailable ? 'Open tool' : 'Upgrade required'}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 p-8">
                    <h2 className="text-2xl font-bold">Account status</h2>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        {subscription
                            ? `Your Stripe subscription is ${subscription.status}.`
                            : 'No active Stripe subscription is linked to this account yet.'}
                    </p>
                    <p className="mt-2 break-all text-sm text-slate-400">
                        {user.email}
                    </p>
                    {subscription?.cancelAtPeriodEnd && (
                        <p className="mt-4 text-sm text-yellow-300">
                            This subscription is scheduled to cancel at the end of the
                            current billing period.
                        </p>
                    )}
                    {portalError && (
                        <p className="mt-4 text-sm text-red-300">{portalError}</p>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {user.plan === 'pro' ? (
                            <button
                                type="button"
                                onClick={handleManageBilling}
                                disabled={isOpeningPortal}
                                className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isOpeningPortal ? 'Opening billing...' : 'Manage billing'}
                            </button>
                        ) : (
                            <Link
                                href="/pricing"
                                className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
                            >
                                View pricing
                            </Link>
                        )}

                        <Link
                            href="/tools/image-fixer"
                            className="rounded-xl border border-white/20 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                        >
                            Fix an image
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function canUseTool(tool: ToolCatalogItem, plan: AuthUser['plan']) {
    if (tool.access === 'guest' || tool.access === 'free') {
        return true;
    }

    return plan === 'pro';
}
