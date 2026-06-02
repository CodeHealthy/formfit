import Link from 'next/link';

export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
        <Link href="/pricing" className="mb-8 text-sm text-blue-400 hover:text-blue-300">
          Back to pricing
        </Link>

        <p className="mb-4 rounded-full border border-green-700 px-4 py-2 text-sm text-green-300">
          Payment successful
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Your FormFit Pro checkout is complete.
        </h1>

        <p className="mt-4 text-slate-400">
          Your subscription status will be activated through Stripe webhooks and
          reflected in your dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Go to dashboard
          </Link>

          <Link
            href="/tools/image-fixer"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
          >
            Open Image Fixer
          </Link>
        </div>
      </div>
    </main>
  );
}
