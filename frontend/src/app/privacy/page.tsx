import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
          Back home
        </Link>

        <p className="mt-10 text-sm font-medium uppercase tracking-widest text-blue-400">
          Privacy
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-slate-400">Last updated: June 3, 2026</p>

        <div className="mt-8 space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">Overview</h2>
            <p className="mt-3">
              FormFit helps users prepare files for online application forms. The
              product is designed to process files in your browser where possible,
              reducing the need to upload file contents to FormFit servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              Files You Process
            </h2>
            <p className="mt-3">
              Browser-side tools process selected images and PDFs locally in your
              browser. FormFit does not intentionally store those uploaded file
              contents for basic browser-side processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              Account and Billing Data
            </h2>
            <p className="mt-3">
              If you create an account, FormFit stores account details such as
              name, email, plan, usage records, and subscription identifiers needed
              to operate the service. Payments are handled by Stripe; FormFit does
              not store card numbers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Service Data</h2>
            <p className="mt-3">
              FormFit may log technical request information such as endpoint,
              status code, timing, and operational errors to maintain reliability
              and diagnose problems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              For privacy or support questions, contact{' '}
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
