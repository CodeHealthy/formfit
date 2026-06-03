import Image from 'next/image';
import Link from 'next/link';

import { HomeAccountLink } from '@/features/auth/components/home-account-link';
import {
  getToolAccessLabel,
  TOOL_CATALOG,
} from '@/features/tools/constants/tool-catalog';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto grid min-h-[92vh] max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-xl shadow-blue-950/20 sm:h-24 sm:w-24">
              <Image
                src="/logo.png"
                alt="FormFit"
                width={80}
                height={80}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                FormFit
              </p>
              <p className="mt-1 text-sm font-medium text-blue-300 sm:text-base">
                Application file fixer
              </p>
            </div>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Make your files fit any application form.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Resize and compress photos, signatures, and form images for
            university applications, job portals, visa forms, exam registrations,
            and government uploads.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/tools/image-fixer"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Try Image Fixer
            </Link>

            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 px-6 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
            >
              View Pricing
            </Link>
            <div className="flex h-12 items-center gap-5 px-1 text-sm font-medium text-slate-400">
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
              <HomeAccountLink />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="border-l border-slate-800 pl-4">
              <p className="text-2xl font-bold">3/day</p>
              <p className="mt-1 text-sm text-slate-400">Guest fixes</p>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <p className="text-2xl font-bold">10/day</p>
              <p className="mt-1 text-sm text-slate-400">Free account fixes</p>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <p className="text-2xl font-bold">200/day</p>
              <p className="mt-1 text-sm text-slate-400">Pro fixes</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-blue-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-sm text-slate-400">Example requirement</p>
              <h2 className="mt-1 text-xl font-semibold">Passport photo</h2>
            </div>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">
              Ready
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Target size</p>
              <p className="mt-1 text-lg font-semibold">600 x 600 px, under 200 KB</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Output</p>
                <p className="mt-1 text-lg font-semibold">JPG</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Processing</p>
                <p className="mt-1 text-lg font-semibold">Browser-side</p>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm leading-6 text-blue-100">
              Choose a preset, upload an image, and download a form-ready file
              without sending image processing work to the server.
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Tools
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Everything you need before uploading an application file.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOOL_CATALOG.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/60 hover:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  <span className="shrink-0 rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                    {getToolAccessLabel(tool.access)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
