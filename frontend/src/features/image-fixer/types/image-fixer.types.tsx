export type OutputImageFormat = 'jpeg' | 'png' | 'webp';

export type FilePreset = {
  id: string;
  name: string;
  description: string;
  category: 'photo' | 'signature' | 'document' | 'custom';
  outputFormat: OutputImageFormat;
  width: number;
  height: number;
  maxSizeKB: number;
  isPremium: boolean;
};

export type PresetsResponse = {
  presets: FilePreset[];
};

export type ImageFixOptions = {
  width: number;
  height: number;
  maxSizeKB: number;
  outputFormat: OutputImageFormat;
};

export type ProcessedImageResult = {
  file: File;
  previewUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  format: OutputImageFormat;
};