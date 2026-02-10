import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInput {
  @ApiProperty({ example: '987e6543-e89b-12d3-a456-426614174000' })
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  productoId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}

export class CreateOrderWithItemsDto {
  @ApiProperty({ example: 'ORD-0001', required: false })
  @IsOptional()
  @IsString()
  numeroOrden?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  usuarioId: string;

  @ApiProperty({ example: 149.95 })
  @IsNumber()
  @IsPositive()
  montoTotal: number;

  @ApiProperty({ example: 'Pedido de prueba', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ example: 'Calle 123', required: false })
  @IsString()
  @IsOptional()
  domicilioEntrega?: string;

  @ApiProperty({ 
    type: [OrderItemInput],
    description: 'Items del pedido'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}
