import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>('MONGODB_URI');
        const dbName = configService.getOrThrow<string>('MONGODB_DB_NAME');

        return {
          uri,
          dbName,
        };
      },
    }),
  ],
})
export class DatabaseModule {}