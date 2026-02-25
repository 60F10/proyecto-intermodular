import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Distribuciones García S.L.', description: 'Nombre del proveedor' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede superar 255 caracteres' })
  nombre: string;

  @ApiProperty({ example: 'Carlos García', description: 'Persona de contacto', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contacto?: string;

  @ApiProperty({ example: 'contacto@garcia.es', description: 'Email del proveedor', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(255)
  email?: string;

  @ApiProperty({ example: '+34 612 345 678', description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiProperty({ example: 'Calle Mayor 12, 2ºA', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ example: 'Madrid', description: 'Ciudad', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @ApiProperty({ example: 'España', description: 'País', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  pais?: string;

  @ApiProperty({ example: 'B12345678', description: 'CIF/NIF del proveedor', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  cif?: string;

  @ApiProperty({ example: 'Lácteos,Carnes,Verduras', description: 'Categorías de suministro separadas por coma', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  categorias_suministro?: string;

  @ApiProperty({ example: 'Proveedor de confianza desde 2019', description: 'Notas internas', required: false })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ example: true, description: 'Estado activo', required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
