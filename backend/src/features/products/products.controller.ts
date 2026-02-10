import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Obtener todos los productos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [Product],
  })
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener producto por SKU' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Product,
  })
  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string): Promise<Product | null> {
    return this.productsService.findBySku(sku);
  }

  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado',
    type: Product,
  })
  @Post()
  async create(@Body() createProductDto: Partial<Product>): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: Product,
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Actualizar stock del producto' })
  @Patch(':id/stock')
  async updateStock(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { cantidad: number },
  ): Promise<Product> {
    return this.productsService.updateStock(id, body.cantidad);
  }

  @ApiOperation({ summary: 'Desactivar producto' })
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> {
    return this.productsService.deactivate(id);
  }
}
