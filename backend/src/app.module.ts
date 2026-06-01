import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BillingModule } from './billing/billing.module';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { PresetsModule } from './presets/presets.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    HealthModule,
    PresetsModule,
    BillingModule,
    AuthModule,
  ],
})
export class AppModule {}