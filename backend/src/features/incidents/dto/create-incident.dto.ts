import { IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentPriority } from '../entities/incident.entity';

export class CreateIncidentDto {
  @ApiProperty({
    example: 'Producto dañado en entrega',
    description: 'Título del incidente',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'El producto llegó con rotura en esquina inferior',
    description: 'Descripción detallada del incidente',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    enum: IncidentPriority,
    example: IncidentPriority.HIGH,
    description: 'Prioridad del incidente',
    required: false,
  })
  @IsOptional()
  @IsEnum(IncidentPriority)
  prioridad?: IncidentPriority;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del pedido relacionado',
  })
  @IsString()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, {
    message: 'pedidoId must be a UUID',
  })
  pedidoId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'UUID del usuario que reporta',
  })
  @IsString()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, {
    message: 'usuarioId must be a UUID',
  })
  usuarioId: string;
}
