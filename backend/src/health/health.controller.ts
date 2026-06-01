import { Controller, Get } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { API_SERVICE_NAME } from '../common/constants/app.constants';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: API_SERVICE_NAME,
      environment: this.configService.get<string>('NODE_ENV'),
      database: {
        connected: this.connection.readyState === 1,
        readyState: this.connection.readyState,
      },
      timestamp: new Date().toISOString(),
    };
  }
}