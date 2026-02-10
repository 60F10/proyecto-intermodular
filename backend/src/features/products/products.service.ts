import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

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
  async create(createProductDto: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  /**
   * Actualiza un producto
   */
  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    await this.findOne(id); // Verificar que existe
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
