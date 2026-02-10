import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryNoteDto {
  @ApiProperty({
    example: 'REM-2025-001',
    description: 'Número único de remito',
  })
  @IsString()
  numeroRemito: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del pedido',
  })
  @IsUUID()
  pedidoId: string;

  @ApiProperty({
    example: 'UPS Logística',
    description: 'Nombre del transportista',
  })
  @IsString()
  transportista: string;

  @ApiProperty({
    example: '1Z999AA10123456784',
    description: 'Número de tracking',
    required: false,
  })
  @IsOptional()
  @IsString()
  numeroTracking?: string;

  @ApiProperty({
    example: 'Sin observaciones',
    description: 'Observaciones sobre la entrega',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
