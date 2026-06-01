import { Injectable } from '@nestjs/common';

import { DEFAULT_FILE_PRESETS } from './constants/default-presets';
import { FilePreset } from './types/preset.types';

@Injectable()
export class PresetsService {
  findAll(): FilePreset[] {
    return DEFAULT_FILE_PRESETS;
  }
}