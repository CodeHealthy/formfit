'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMe } from '@/features/auth/api/auth.api';
import type { AuthUser } from '@/features/auth/types/auth.types';
import { clearAccessToken } from '@/lib/auth-storage';

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getMe();
                setUser(currentUser);
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

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
                    <div>
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
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <p className="text-sm text-slate-400">Daily image fixes</p>
                        <p className="mt-3 text-3xl font-bold">
                            {user.plan === 'pro' ? '200' : '10'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                        <p className="text-sm text-slate-400">Account email</p>
                        <p className="mt-3 break-all text-lg font-semibold">
                            {user.email}
                        </p>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 p-8">
                    <h2 className="text-2xl font-bold">Next up: usage tracking</h2>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        Your account is ready. The next feature will track daily fixes and
                        connect Pro access to Stripe subscriptions.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/pricing"
                            className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            View pricing
                        </Link>

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