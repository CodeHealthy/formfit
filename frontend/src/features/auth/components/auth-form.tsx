'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { setAccessToken } from '@/lib/auth-storage';
import { login, signup } from '../api/auth.api';

type AuthFormMode = 'login' | 'signup';

type AuthFormProps = {
    mode: AuthFormMode;
};

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();

    const isSignup = mode === 'signup';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError('');

            const response = isSignup
                ? await signup({
                    name,
                    email,
                    password,
                })
                : await login({
                    email,
                    password,
                });

            setAccessToken(response.accessToken);
            router.push('/dashboard');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                    FormFit
                </p>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                    {isSignup ? 'Create your account' : 'Welcome back'}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    {isSignup
                        ? 'Start saving your usage, plan, and file-fixing limits with a free account.'
                        : 'Log in to access your dashboard, usage limits, and billing status.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {isSignup && (
                    <label className="block">
                        <span className="text-sm font-medium text-slate-300">Name</span>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            minLength={2}
                            placeholder="Your name"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </label>
                )}

                <label className="block">
                    <span className="text-sm font-medium text-slate-300">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-slate-300">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={8}
                        placeholder="Minimum 8 characters"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </label>

                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? isSignup
                            ? 'Creating account...'
                            : 'Logging in...'
                        : isSignup
                            ? 'Create free account'
                            : 'Log in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
                {isSignup ? 'Already have an account?' : 'New to FormFit?'}{' '}
                <Link
                    href={isSignup ? '/login' : '/signup'}
                    className="font-medium text-blue-400 hover:text-blue-300"
                >
                    {isSignup ? 'Log in' : 'Create an account'}
                </Link>
            </p>
        </div>
    );
}