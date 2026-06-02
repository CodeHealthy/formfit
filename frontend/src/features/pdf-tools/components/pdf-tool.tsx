'use client';

import { ChangeEvent, useState } from 'react';

import {
  convertImagesToPdf,
  mergePdfFiles,
  optimizePdfFile,
  PdfToolResult,
  splitPdfFile,
} from '../utils/pdf-tools';

type PdfToolMode = 'image-to-pdf' | 'compress-pdf' | 'merge-pdf' | 'split-pdf';

type PdfToolProps = {
  mode: PdfToolMode;
};

const TOOL_COPY: Record<
  PdfToolMode,
  {
    title: string;
    description: string;
    accept: string;
    multiple: boolean;
    button: string;
    note: string;
  }
> = {
  'image-to-pdf': {
    title: 'Image to PDF',
    description: 'Turn JPG, PNG, and WEBP images into a single PDF.',
    accept: 'image/png,image/jpeg,image/webp',
    multiple: true,
    button: 'Create PDF',
    note: 'Images are converted in your browser and placed one per PDF page.',
  },
  'compress-pdf': {
    title: 'PDF Optimizer',
    description: 'Re-save a PDF with browser-side object stream optimization.',
    accept: 'application/pdf',
    multiple: false,
    button: 'Optimize PDF',
    note: 'This can reduce structural overhead, but it does not recompress embedded images.',
  },
  'merge-pdf': {
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one download.',
    accept: 'application/pdf',
    multiple: true,
    button: 'Merge PDFs',
    note: 'Pages are copied in the order you select the files.',
  },
  'split-pdf': {
    title: 'Split PDF',
    description: 'Extract selected pages from a PDF.',
    accept: 'application/pdf',
    multiple: false,
    button: 'Split PDF',
    note: 'Use ranges like 1-3,5. Leave blank to copy all pages.',
  },
};

export function PdfTool({ mode }: PdfToolProps) {
  const copy = TOOL_COPY[mode];
  const [files, setFiles] = useState<File[]>([]);
  const [pageRange, setPageRange] = useState('');
  const [result, setResult] = useState<PdfToolResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
    setResult(null);
    setError('');
  }

  async function handleProcess() {
    if (files.length === 0) {
      setError('Please choose a file first.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setResult(null);

      const nextResult = await runTool();
      setResult(nextResult);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not process this PDF. Please try another file.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function runTool() {
    if (mode === 'image-to-pdf') {
      return convertImagesToPdf(files);
    }

    if (mode === 'merge-pdf') {
      if (files.length < 2) {
        throw new Error('Please choose at least two PDFs to merge.');
      }

      return mergePdfFiles(files);
    }

    if (mode === 'compress-pdf') {
      return optimizePdfFile(files[0]);
    }

    return splitPdfFile(files[0], pageRange);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-2 text-sm text-slate-400">{copy.description}</p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Files</span>
            <input
              type="file"
              accept={copy.accept}
              multiple={copy.multiple}
              onChange={handleFileChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
            />
          </label>

          {mode === 'split-pdf' && (
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Page range
              </span>
              <input
                type="text"
                value={pageRange}
                onChange={(event) => setPageRange(event.target.value)}
                placeholder="1-3,5"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </label>
          )}

          {files.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              {files.map((file) => (
                <p key={`${file.name}-${file.size}`}>
                  {file.name} - {Math.round(file.size / 1024)} KB
                </p>
              ))}
            </div>
          )}

          <p className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            {copy.note}
          </p>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={handleProcess}
            disabled={files.length === 0 || isProcessing}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : copy.button}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Result</h2>
        <p className="mt-2 text-sm text-slate-400">
          Your processed PDF will appear here.
        </p>

        {!result && (
          <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
            No PDF processed yet.
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-green-400">
              <p>File: {result.file.name}</p>
              <p>Size: {result.sizeKB} KB</p>
            </div>

            <a
              href={result.downloadUrl}
              download={result.file.name}
              className="block rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition hover:bg-green-500"
            >
              Download PDF
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
