import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('db')
  async db() {
    const result = await this.dataSource.query('SELECT 1 as ok');
    return { db: 'up', result };
  }
}
