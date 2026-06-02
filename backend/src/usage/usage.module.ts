import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { UsageLog, UsageLogSchema } from './schemas/usage-log.schema';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: UsageLog.name,
        schema: UsageLogSchema,
      },
    ]),
  ],
  controllers: [UsageController],
  providers: [UsageService],
})
export class UsageModule {}
