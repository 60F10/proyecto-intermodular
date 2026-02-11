import { IsString, IsNumber, IsOptional, Min, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop Dell XPS 13',
    description: 'Nombre del producto',
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    example: 'Laptop de alta gama para desarrollo',
    description: 'Descripción del producto',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @ApiProperty({
    example: 'DELL-XPS-13',
    description: 'SKU único del producto',
  })
  @IsString({ message: 'El SKU debe ser texto' })
  @MinLength(3, { message: 'El SKU debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El SKU no puede exceder 100 caracteres' })
  sku: string;

  @ApiProperty({
    example: 1299.99,
    description: 'Precio unitario del producto',
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @ApiProperty({
    example: 50,
    description: 'Stock inicial del producto',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @ApiProperty({
    example: 'Electrónica',
    description: 'Categoría del producto',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser texto' })
  @MaxLength(255)
  categoria?: string;
}
