'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/lib/api-client';
import {
  consumeImageFix,
  getImageFixUsageStatus,
} from '@/features/usage/api/usage.api';
import type { UsageStatus } from '@/features/usage/types/usage.types';
import { getAnonymousUsageId } from '@/features/usage/utils/anonymous-usage-id';
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
  fitMode: 'cover',
  cropPosition: 'center',
  background: 'white',
  filename: 'formfit-result',
};

type ImageFixerProps = {
  initialOptions?: Partial<ImageFixOptions>;
  title?: string;
};

export function ImageFixer({ initialOptions, title }: ImageFixerProps) {
  const [presets, setPresets] = useState<FilePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState('');
  const [options, setOptions] = useState<ImageFixOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
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

        if (data.presets.length > 0 && !initialOptions) {
          const firstPreset = data.presets[0];
          setSelectedPresetId(firstPreset.id);
          setOptions((currentOptions) => ({
            ...currentOptions,
            width: firstPreset.width,
            height: firstPreset.height,
            maxSizeKB: firstPreset.maxSizeKB,
            outputFormat: firstPreset.outputFormat,
          }));
        }
      } catch {
        setError('Could not load file presets');
      }
    }

    loadPresets();
  }, [initialOptions]);

  useEffect(() => {
    async function loadUsageStatus() {
      try {
        const status = await getImageFixUsageStatus(getAnonymousUsageId());
        setUsageStatus(status);
      } catch {
        setUsageStatus(null);
      }
    }

    loadUsageStatus();
  }, []);

  useEffect(() => {
    if (!selectedPreset) {
      return;
    }

    setOptions((currentOptions) => ({
      ...currentOptions,
      width: selectedPreset.width,
      height: selectedPreset.height,
      maxSizeKB: selectedPreset.maxSizeKB,
      outputFormat: selectedPreset.outputFormat,
    }));
  }, [selectedPreset]);

  useEffect(() => {
    return () => {
      if (originalPreviewUrl) {
        URL.revokeObjectURL(originalPreviewUrl);
      }
    };
  }, [originalPreviewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setResult(null);
    setError('');

    if (!selectedFile) {
      setFile(null);
      setOriginalPreviewUrl('');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setFile(null);
      setOriginalPreviewUrl('');
      return;
    }

    if (originalPreviewUrl) {
      URL.revokeObjectURL(originalPreviewUrl);
    }

    setFile(selectedFile);
    setOriginalPreviewUrl(URL.createObjectURL(selectedFile));
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

      const status = await consumeImageFix(getAnonymousUsageId());
      setUsageStatus(status);

      const processedImage = await processImageFile(file, options);
      setResult(processedImage);

      if (!processedImage.targetReached) {
        setError(
          'The image was processed, but the target KB could not be reached without risking very low quality.',
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not process image. Please try another file.';

      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          {title ?? 'Upload requirement'}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Choose a preset or enter custom dimensions and file size.
        </p>
        <p className="mt-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-100">
          Your image is processed in your browser. FormFit only checks usage
          limits before processing.
        </p>
        {usageStatus && (
          <p className="mt-3 text-sm text-slate-300">
            {usageStatus.remainingToday} of {usageStatus.dailyLimit} fixes
            remaining today.
          </p>
        )}

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
            <NumberField
              label="Width"
              value={options.width}
              min={50}
              max={4000}
              step={10}
              onChange={(value) => updateOption('width', value)}
            />
            <NumberField
              label="Height"
              value={options.height}
              min={50}
              max={4000}
              step={10}
              onChange={(value) => updateOption('height', value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Max size KB"
              value={options.maxSizeKB}
              min={10}
              max={5000}
              step={10}
              onChange={(value) => updateOption('maxSizeKB', value)}
            />

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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Crop mode
              </span>
              <select
                value={options.fitMode}
                onChange={(event) =>
                  updateOption(
                    'fitMode',
                    event.target.value as ImageFixOptions['fitMode'],
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="cover">Fill exact size</option>
                <option value="contain">Fit inside size</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Crop position
              </span>
              <select
                value={options.cropPosition}
                onChange={(event) =>
                  updateOption(
                    'cropPosition',
                    event.target.value as ImageFixOptions['cropPosition'],
                  )
                }
                disabled={options.fitMode === 'contain'}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Background
              </span>
              <select
                value={options.background}
                onChange={(event) =>
                  updateOption(
                    'background',
                    event.target.value as ImageFixOptions['background'],
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="white">White</option>
                <option value="transparent">Transparent</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                File name
              </span>
              <input
                type="text"
                value={options.filename}
                onChange={(event) =>
                  updateOption('filename', event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
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
        <h2 className="text-xl font-semibold text-white">Preview</h2>
        <p className="mt-2 text-sm text-slate-400">
          Your original or processed file will appear here.
        </p>

        {!result && (
          <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
            {originalPreviewUrl ? (
              <img
                src={originalPreviewUrl}
                alt="Original upload preview"
                className="max-h-80 w-full rounded-xl object-contain"
              />
            ) : (
              'No file uploaded yet.'
            )}
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

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  function handleChange(nextValue: number) {
    if (Number.isNaN(nextValue)) {
      return;
    }

    onChange(Math.min(Math.max(nextValue, min), max));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => handleChange(Number(event.target.value))}
          className="h-9 w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 text-right text-sm font-medium text-white outline-none focus:border-blue-500"
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => handleChange(Number(event.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-blue-500 outline-none"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
