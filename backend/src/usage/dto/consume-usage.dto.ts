import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ConsumeUsageDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  anonymousId?: string;
}
