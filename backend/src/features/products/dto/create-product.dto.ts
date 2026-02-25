import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, Min, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'ING-0001' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  code: string;

  @ApiProperty({ example: 'Zanahoria' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({ enum: ProductType, example: 'INGREDIENT' })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({ example: 'KG' })
  @IsString()
  @MaxLength(30)
  unitType: string;

  @ApiProperty({ example: 0.63 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 'uuid-of-supplier' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'uuid-of-user', required: false })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiProperty({ example: 80.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yieldPercent?: number;

  @ApiProperty({ example: 0.805, required: false })
  @IsOptional()
  @IsNumber()
  relation?: number;
}
