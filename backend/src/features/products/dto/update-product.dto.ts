import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para actualizar un producto
 * Todos los campos son opcionales
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
