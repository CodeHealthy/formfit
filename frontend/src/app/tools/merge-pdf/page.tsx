import Link from 'next/link';

import { ToolAccessGuard } from '@/features/auth/components/tool-access-guard';
import { PdfTool } from '@/features/pdf-tools/components/pdf-tool';

export default function MergePdfPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">Merge PDF</h1>
        </div>
        <ToolAccessGuard requiredPlan="pro" toolName="Merge PDF">
          <PdfTool mode="merge-pdf" />
        </ToolAccessGuard>
      </div>
    </main>
  );
}
