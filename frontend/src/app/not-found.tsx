import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <section className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          This page does not fit.
        </h1>
        <p className="mt-4 text-slate-400">
          The page you are looking for may have moved, or the link may be
          incomplete.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Back home
          </Link>
          <Link
            href="/tools/image-fixer"
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Open Image Fixer
          </Link>
        </div>
      </section>
    </main>
  );
}
