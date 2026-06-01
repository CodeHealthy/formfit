import Link from 'next/link';

export default function BillingCancelPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
        <p className="mb-4 rounded-full border border-yellow-700 px-4 py-2 text-sm text-yellow-300">
          Checkout canceled
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          No payment was completed.
        </h1>

        <p className="mt-4 text-slate-400">
          You can continue using the free FormFit tools or return to pricing
          whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/tools/image-fixer"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Continue free
          </Link>

          <Link
            href="/pricing"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
          >
            Back to pricing
          </Link>
        </div>
      </div>
    </main>
  );
}