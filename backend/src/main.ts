import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 5000;
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is missing from environment variables');
  }

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.listen(port);

  console.log(`FormFit API is running on port ${port}`);
}

bootstrap();