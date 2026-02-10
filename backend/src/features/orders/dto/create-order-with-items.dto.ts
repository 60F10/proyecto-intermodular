import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInput {
  @ApiProperty({ example: '987e6543-e89b-12d3-a456-426614174000' })
  @IsUUID()
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
  @ApiProperty({ example: 'ORD-0001' })
  @IsString()
  numeroOrden: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
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
