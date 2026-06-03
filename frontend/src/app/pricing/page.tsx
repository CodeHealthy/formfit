import Link from 'next/link';

import { PricingCard } from '@/features/billing/components/pricing-card';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back home
        </Link>

        <div className="mt-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            Pricing
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Start free, upgrade when you need more.
          </h1>

          <p className="mt-4 text-slate-400">
            FormFit keeps basic image fixing accessible, while Pro unlocks
            higher limits and advanced workflows.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Free</h2>
            <p className="mt-2 text-slate-400">
              For quick file fixes and testing FormFit.
            </p>

            <p className="mt-6 text-4xl font-bold text-white">$0</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>✓ 3 guest fixes per day</li>
              <li>✓ Basic image fixer access</li>
              <li>✓ Browser-side processing</li>
              <li>✓ No account required for the starter tool</li>
            </ul>

            <Link
              href="/tools/image-fixer"
              className="mt-6 block rounded-lg border border-slate-700 px-4 py-3 text-center font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Continue free
            </Link>
          </div>

          <PricingCard
            plan="pro"
            name="Pro"
            price="$8/mo"
            description="For users who regularly fix application files."
            features={[
              'Higher daily limits',
              'Advanced PDF optimizer',
              'Merge PDF and split PDF',
              'Priority access to future tools',
              'Priority feature access',
            ]}
          />
        </div>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Tool access by plan</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <AccessColumn
              title="Guest"
              items={['Image Form Fixer', '3 image fixes per day']}
            />
            <AccessColumn
              title="Free account"
              items={[
                'Signature Resizer',
                'Image to PDF',
                '10 image fixes per day',
              ]}
            />
            <AccessColumn
              title="Pro"
              items={[
                'PDF Optimizer',
                'Merge PDF',
                'Split PDF',
                '200 image fixes per day',
              ]}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function AccessColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
