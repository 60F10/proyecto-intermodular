import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'ORD-2025-001',
    description: 'Número único de orden',
  })
  @IsString()
  numeroOrden: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del usuario que realiza la orden',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    example: 5999.99,
    description: 'Monto total de la orden',
  })
  @IsNumber()
  @Min(0)
  montoTotal: number;

  @ApiProperty({
    example: 'Entregar en recepción',
    description: 'Observaciones sobre la orden',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({
    example: 'Calle 123, Apto 4B, Buenos Aires',
    description: 'Domicilio de entrega',
    required: false,
  })
  @IsOptional()
  @IsString()
  domicilioEntrega?: string;
}
