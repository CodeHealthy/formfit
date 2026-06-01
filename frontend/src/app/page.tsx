import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          FormFit MVP
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Make your files fit any application form.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Resize, compress, crop, and convert photos, signatures, PDFs, and
          documents so they meet online upload requirements.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tools/image-fixer"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Try Image Fixer
            </Link>

            <Link
              href="/signup"
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
            >
              Create free account
            </Link>

            <Link
              href="/login"
              className="rounded-lg px-6 py-3 font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}