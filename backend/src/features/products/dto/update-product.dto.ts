import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar un producto
 * Todos los campos son opcionales
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: true,
    description: 'Indica si el producto está activo',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
