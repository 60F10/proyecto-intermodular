import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryMovementDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del producto',
  })
  @IsUUID()
  productoId: string;

  @ApiProperty({
    example: 10,
    description: 'Cantidad del movimiento',
  })
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty({
    example: 'Reposición de stock',
    description: 'Motivo del movimiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'UUID del usuario que registra',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    example: 'Sin observaciones',
    description: 'Observaciones adicionales',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
