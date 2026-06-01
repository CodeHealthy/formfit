'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/lib/api-client';
import { processImageFile } from '../utils/image-processor';
import {
  FilePreset,
  ImageFixOptions,
  OutputImageFormat,
  PresetsResponse,
  ProcessedImageResult,
} from '../types/image-fixer.types';

const DEFAULT_OPTIONS: ImageFixOptions = {
  width: 600,
  height: 600,
  maxSizeKB: 200,
  outputFormat: 'jpeg',
};

export function ImageFixer() {
  const [presets, setPresets] = useState<FilePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ImageFixOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const selectedPreset = useMemo(() => {
    return presets.find((preset) => preset.id === selectedPresetId);
  }, [presets, selectedPresetId]);

  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await apiClient<PresetsResponse>('/presets');
        setPresets(data.presets);

        if (data.presets.length > 0) {
          const firstPreset = data.presets[0];
          setSelectedPresetId(firstPreset.id);
          setOptions({
            width: firstPreset.width,
            height: firstPreset.height,
            maxSizeKB: firstPreset.maxSizeKB,
            outputFormat: firstPreset.outputFormat,
          });
        }
      } catch {
        setError('Could not load file presets');
      }
    }

    loadPresets();
  }, []);

  useEffect(() => {
    if (!selectedPreset) {
      return;
    }

    setOptions({
      width: selectedPreset.width,
      height: selectedPreset.height,
      maxSizeKB: selectedPreset.maxSizeKB,
      outputFormat: selectedPreset.outputFormat,
    });
  }, [selectedPreset]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setResult(null);
    setError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  function updateOption<K extends keyof ImageFixOptions>(
    key: K,
    value: ImageFixOptions[K],
  ) {
    setSelectedPresetId('');
    setOptions((currentOptions) => ({
      ...currentOptions,
      [key]: value,
    }));
  }

  async function handleProcessImage() {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setResult(null);

      const processedImage = await processImageFile(file, options);
      setResult(processedImage);
    } catch {
      setError('Could not process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Upload requirement</h2>
        <p className="mt-2 text-sm text-slate-400">
          Choose a preset or enter custom dimensions and file size.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Preset</span>
            <select
              value={selectedPresetId}
              onChange={(event) => setSelectedPresetId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
            >
              <option value="">Custom requirement</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </label>

          {selectedPreset && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              {selectedPreset.description}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Width
              </span>
              <input
                type="number"
                min={1}
                value={options.width}
                onChange={(event) =>
                  updateOption('width', Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Height
              </span>
              <input
                type="number"
                min={1}
                value={options.height}
                onChange={(event) =>
                  updateOption('height', Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Max size KB
              </span>
              <input
                type="number"
                min={1}
                value={options.maxSizeKB}
                onChange={(event) =>
                  updateOption('maxSizeKB', Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Output format
              </span>
              <select
                value={options.outputFormat}
                onChange={(event) =>
                  updateOption(
                    'outputFormat',
                    event.target.value as OutputImageFormat,
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Upload image
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
            />
          </label>

          {file && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p>Original file: {file.name}</p>
              <p>Original size: {Math.round(file.size / 1024)} KB</p>
              <p>Original type: {file.type}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={handleProcessImage}
            disabled={!file || isProcessing}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Fixing image...' : 'Fix my image'}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Result</h2>
        <p className="mt-2 text-sm text-slate-400">
          Your processed file will appear here.
        </p>

        {!result && (
          <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
            No file processed yet.
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-5">
            <img
              src={result.previewUrl}
              alt="Processed result"
              className="max-h-80 w-full rounded-xl border border-slate-800 object-contain"
            />

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-green-400">
              <p>Format: {result.format.toUpperCase()}</p>
              <p>
                Dimensions: {result.width}x{result.height}px
              </p>
              <p>Size: {result.sizeKB} KB</p>
            </div>

            <a
              href={result.previewUrl}
              download={result.file.name}
              className="block rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition hover:bg-green-500"
            >
              Download fixed file
            </a>
          </div>
        )}
      </section>
    </div>
  );
}