import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ConsumeUsageDto } from './dto/consume-usage.dto';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post('consume')
  @UseGuards(OptionalJwtAuthGuard)
  consumeImageFix(
    @CurrentUser() user: JwtPayload | null,
    @Body() dto: ConsumeUsageDto,
  ) {
    return this.usageService.consumeImageFix({
      userId: user?.sub,
      anonymousId: dto.anonymousId,
    });
  }

  @Get('status')
  @UseGuards(OptionalJwtAuthGuard)
  getImageFixStatus(
    @CurrentUser() user: JwtPayload | null,
    @Query('anonymousId') anonymousId?: string,
  ) {
    return this.usageService.getImageFixStatus({
      userId: user?.sub,
      anonymousId,
    });
  }
}
