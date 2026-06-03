import Link from 'next/link';

import { ToolAccessGuard } from '@/features/auth/components/tool-access-guard';
import { ImageFixer } from '@/features/image-fixer/components/image-fixer';

export default function SignatureResizerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
            Back home
          </Link>

          <p className="mt-6 mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            FormFit Tool
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Signature Resizer
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Resize and compress scanned signatures for exam, visa, scholarship,
            and job application forms.
          </p>
        </div>

        <ToolAccessGuard toolName="Signature Resizer">
          <ImageFixer
            title="Signature requirement"
            initialOptions={{
              width: 300,
              height: 100,
              maxSizeKB: 50,
              outputFormat: 'png',
              fitMode: 'contain',
              background: 'transparent',
              filename: 'formfit-signature',
            }}
          />
        </ToolAccessGuard>
      </div>
    </main>
  );
}
