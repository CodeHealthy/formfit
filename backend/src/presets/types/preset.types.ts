export type PresetCategory = 'photo' | 'signature' | 'document' | 'custom';

export type OutputImageFormat = 'jpeg' | 'png' | 'webp';

export type FilePreset = {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  outputFormat: OutputImageFormat;
  width: number;
  height: number;
  maxSizeKB: number;
  isPremium: boolean;
};