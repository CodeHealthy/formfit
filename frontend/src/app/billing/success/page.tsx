import Link from 'next/link';

export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
        <p className="mb-4 rounded-full border border-green-700 px-4 py-2 text-sm text-green-300">
          Payment successful
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Your FormFit Pro checkout is complete.
        </h1>

        <p className="mt-4 text-slate-400">
          Your subscription status will be activated through Stripe webhooks.
          Account-based access will be connected after authentication is added.
        </p>

        <Link
          href="/tools/image-fixer"
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
        >
          Go to Image Fixer
        </Link>
      </div>
    </main>
  );
}