import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
          Back home
        </Link>

        <p className="mt-10 text-sm font-medium uppercase tracking-widest text-blue-400">
          Terms
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-4 text-slate-400">Last updated: June 3, 2026</p>

        <div className="mt-8 space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">Use of FormFit</h2>
            <p className="mt-3">
              FormFit provides file preparation tools for application form upload
              requirements. You are responsible for checking that processed files
              meet the rules of the portal where you submit them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              Guest, Free, and Pro Access
            </h2>
            <p className="mt-3">
              Tool access and usage limits may vary by plan. Guest users receive
              limited access, free accounts receive higher limits and selected
              tools, and Pro users receive access to advanced tools and higher
              limits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Billing</h2>
            <p className="mt-3">
              Pro billing is handled through Stripe. Subscription management,
              card updates, invoices, and cancellation flows are provided through
              Stripe-hosted pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              File Processing
            </h2>
            <p className="mt-3">
              FormFit aims to process files in the browser where possible. Some
              results may vary depending on the original file quality, browser
              support, and target size requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              Availability and Changes
            </h2>
            <p className="mt-3">
              FormFit may change limits, features, pricing, or availability over
              time as the product improves. The service is provided without a
              guarantee that every target file size or portal requirement can be
              met.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              For questions, contact{' '}
              <Link
                href="mailto:iamyeshar@gmail.com"
                className="text-blue-300 hover:text-blue-200"
              >
                iamyeshar@gmail.com
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
