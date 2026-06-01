import { Controller, Get } from '@nestjs/common';

import type { PresetResponseDto } from './dto/preset-response.dto';
import { PresetsService } from './presets.service';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Get()
  findAll(): PresetResponseDto {
    return {
      presets: this.presetsService.findAll(),
    };
  }
}