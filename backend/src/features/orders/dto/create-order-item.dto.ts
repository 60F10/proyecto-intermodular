import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del pedido'
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({ 
    example: '987e6543-e89b-12d3-a456-426614174000',
    description: 'ID del producto'
  })
  @IsUUID()
  productoId: string;

  @ApiProperty({ 
    example: 5,
    description: 'Cantidad de items'
  })
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ 
    example: 29.99,
    description: 'Precio unitario del producto en este pedido'
  })
  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}
