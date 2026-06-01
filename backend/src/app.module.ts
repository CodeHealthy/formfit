import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const dbName = configService.get<string>('MONGODB_DB_NAME');

        if (!uri) {
          throw new Error('MONGODB_URI is missing from environment variables');
        }

        if (!dbName) {
          throw new Error('MONGODB_DB_NAME is missing from environment variables');
        }

        return {
          uri,
          dbName,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}