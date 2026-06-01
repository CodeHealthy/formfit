'use client';

import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  service: string;
  environment: string;
  timestamp: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function checkBackendHealth() {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
          throw new Error('NEXT_PUBLIC_API_BASE_URL is missing');
        }

        const response = await fetch(`${apiBaseUrl}/health`);

        if (!response.ok) {
          throw new Error('Backend health check failed');
        }

        const data = (await response.json()) as HealthResponse;
        setHealth(data);
      } catch {
        setError('Could not connect to backend API');
      }
    }

    checkBackendHealth();
  }, []);

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

        <div className="mt-10 w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-6 text-left">
          <h2 className="text-lg font-semibold">Backend Connection</h2>

          {health && (
            <div className="mt-4 space-y-2 text-sm text-green-400">
              <p>Status: {health.status}</p>
              <p>Service: {health.service}</p>
              <p>Environment: {health.environment}</p>
              <p>Timestamp: {health.timestamp}</p>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {!health && !error && (
            <p className="mt-4 text-sm text-slate-400">
              Checking backend connection...
            </p>
          )}
        </div>
      </section>
    </main>
  );
}