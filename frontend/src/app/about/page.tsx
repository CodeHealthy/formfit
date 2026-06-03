import Image from 'next/image';
import Link from 'next/link';



export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
          Back home
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-2">
                <Image
                  src="/logo.png"
                  alt="FormFit"
                  width={88}
                  height={88}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm text-blue-300">Product Owner</p>
                <h1 className="mt-1 text-3xl font-bold">Muhammad Yeshar</h1>
                <p className="mt-1 text-slate-400">Software Developer</p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-300">
              I build practical full-stack products with a focus on clean user
              workflows, reliable backend systems, and low-friction deployment.
              FormFit grew from a common problem: application portals often reject
              otherwise valid files because of strict size, format, or dimension
              rules.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="mailto:iamyeshar@gmail.com"
                className="rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-500"
              >
                Contact support
              </Link>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="https://github.com/CodeHealthy"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-center font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/iamyeshar"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-700 px-4 py-3 text-center font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </aside>

          <section>
            <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
              About FormFit
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              A focused file preparation workspace for application forms.
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              FormFit helps students, applicants, job seekers, and professionals
              prepare files before uploading them to university, visa, scholarship,
              exam, job, and government portals.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              The product is intentionally browser-first. Image and PDF operations
              run locally where possible to keep the service fast, affordable, and
              privacy-aware, while accounts, subscriptions, billing, and usage
              limits are handled through the backend.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoCard label="Built for" value="Strict upload portals" />
              <InfoCard label="Processing" value="Browser-first tools" />
              <InfoCard label="Business model" value="Guest, Free, Pro" />
            </div>

            
          </section>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
