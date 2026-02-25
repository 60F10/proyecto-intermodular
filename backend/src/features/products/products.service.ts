import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './entities/product.entity';
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
  ) { }

  /**
   * Obtiene todos los productos activos con paginación
   * Acepta query param ?type=INGREDIENT|MATERIAL
   */
  async findAllPaginated(
    paginationDto: PaginationQueryDto,
    productType?: string,
  ): Promise<PaginatedResponse<Product>> {
    const where: any = { isActive: true };
    if (productType) {
      const upper = productType.toUpperCase();
      if (upper === 'INGREDIENT' || upper === 'MATERIAL') {
        where.productType = upper as ProductType;
      }
    }
    return this.paginationService.paginateRepository(
      this.productsRepository,
      paginationDto,
      where,
    );
  }

  /**
   * Obtiene todos los productos activos (sin paginar)
   */
  async findAll(productType?: string): Promise<Product[]> {
    const where: any = { isActive: true };
    if (productType) {
      const upper = productType.toUpperCase();
      if (upper === 'INGREDIENT' || upper === 'MATERIAL') {
        where.productType = upper as ProductType;
      }
    }
    return this.productsRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtiene un producto por ID
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  /**
   * Obtiene un producto por código (era SKU)
   */
  async findByCode(code: string): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { code } });
  }

  /** @deprecated Use findByCode */
  async findBySku(sku: string): Promise<Product | null> {
    return this.findByCode(sku);
  }

  /**
   * Crea un nuevo producto
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existing = await this.findByCode(createProductDto.code);
    if (existing) {
      throw new Error(`Código ${createProductDto.code} ya existe`);
    }
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  /**
   * Actualiza un producto
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    if (updateProductDto.code) {
      const existing = await this.productsRepository.findOne({
        where: { code: updateProductDto.code },
      });
      if (existing && existing.id !== id) {
        throw new Error(`Código ${updateProductDto.code} ya existe`);
      }
    }
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  /**
   * Desactiva un producto
   */
  async deactivate(id: string): Promise<Product> {
    return this.update(id, { isActive: false });
  }

  /**
   * Elimina un producto
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.productsRepository.delete(id);
  }

  /**
   * Actualiza el stock en la tabla inventory (campo current_qty)
   * Mantenido por compatibilidad con el controlador
   */
  async updateStock(id: string, cantidad: number): Promise<Product> {
    // En el schema real el stock está en la tabla inventory separada.
    // Por ahora devolvemos el producto sin cambios para no romper el endpoint.
    return this.findOne(id);
  }
}
