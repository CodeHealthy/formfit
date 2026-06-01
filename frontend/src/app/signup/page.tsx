import Link from 'next/link';

import { AuthForm } from '@/features/auth/components/auth-form';

export default function SignupPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10 text-white">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col">
                <Link href="/" className="text-sm text-slate-400 hover:text-white">
                    ← Back to home
                </Link>

                <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1fr_440px]">
                    <section>
                        <p className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                            Start free
                        </p>

                        <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
                            Create your FormFit account and unlock better limits.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                            Free accounts will get more daily fixes than guests, plus a
                            dashboard for usage, plan status, and future file presets.
                        </p>
                    </section>

                    <AuthForm mode="signup" />
                </div>
            </div>
        </main>
    );
}