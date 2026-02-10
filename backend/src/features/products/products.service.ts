import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { PaginationService } from '../../common/services/pagination.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Obtiene todos los productos activos con paginación
   */
  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Product>> {
    return this.paginationService.paginateRepository(
      this.productsRepository,
      paginationDto,
      { activo: true },
    );
  }

  /**
   * Obtiene todos los productos activos
   */
  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { activo: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene un producto por ID
   * @param id - UUID del producto
   * @throws NotFoundException si el producto no existe
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  /**
   * Obtiene un producto por SKU
   */
  async findBySku(sku: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { sku },
    });
  }

  /**
   * Crea un nuevo producto
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar que el SKU sea único
    const existingSku = await this.findBySku(createProductDto.sku);
    if (existingSku) {
      throw new Error(`SKU ${createProductDto.sku} ya existe`);
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  /**
   * Actualiza un producto
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id); // Verificar que existe

    // Si se actualiza el SKU, verificar que sea único
    if (updateProductDto.sku) {
      const existingSku = await this.productsRepository.findOne({
        where: {
          sku: updateProductDto.sku,
        },
      });

      if (existingSku && existingSku.id !== id) {
        throw new Error(`SKU ${updateProductDto.sku} ya existe`);
      }
    }

    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  /**
   * Desactiva un producto
   */
  async deactivate(id: string): Promise<Product> {
    return this.update(id, { activo: false });
  }

  /**
   * Elimina un producto (soft delete)
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.productsRepository.delete(id);
  }

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(id: string, cantidad: number): Promise<Product> {
    const product = await this.findOne(id);
    const nuevoStock = product.stock + cantidad;

    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return this.update(id, { stock: nuevoStock });
  }
}
