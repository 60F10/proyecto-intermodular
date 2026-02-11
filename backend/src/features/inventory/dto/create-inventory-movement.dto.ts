import { IsString, IsNumber, IsOptional, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateInventoryMovementDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del producto',
  })
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  @Transform(({ obj }) => obj.productoId ?? obj.producto_id)
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
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  @Transform(({ obj }) => obj.usuarioId ?? obj.usuario_id)
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
