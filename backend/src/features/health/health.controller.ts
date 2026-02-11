import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @ApiOperation({ summary: 'Verificar estado de la base de datos' })
  @ApiResponse({
    status: 200,
    description: 'Base de datos está disponible',
    schema: {
      example: {
        db: 'up',
        result: [{ ok: 1 }],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Base de datos no disponible' })
  @Get('db')
  async db() {
    const result = await this.dataSource.query('SELECT 1 as ok');
    return { db: 'up', result };
  }

  
}
