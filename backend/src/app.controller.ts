import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getRoot() {
    return {
      message: 'FormFit API is running',
      environment: this.configService.get<string>('NODE_ENV'),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'formfit-backend',
      environment: this.configService.get<string>('NODE_ENV'),
      timestamp: new Date().toISOString(),
    };
  }
}