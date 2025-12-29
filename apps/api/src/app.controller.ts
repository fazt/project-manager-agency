import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Verifica que la API esté funcionando' })
  @ApiResponse({ status: 200, description: 'API funcionando correctamente' })
  getHello(): string {
    return this.appService.getHello();
  }
}
