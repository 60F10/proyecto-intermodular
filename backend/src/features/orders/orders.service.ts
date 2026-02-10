import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { PaginationService } from '../../common/services/pagination.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Obtiene todos los pedidos con paginación
   */
  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Order>> {
    return this.paginationService.paginateRepository(
      this.ordersRepository,
      paginationDto,
    );
  }

  /**
   * Obtiene todos los pedidos
   */
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene un pedido por ID
   */
  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  /**
   * Obtiene pedidos por usuario con paginación
   */
  async findByUsuarioPaginated(
    usuarioId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Order>> {
    return this.paginationService.paginateRepository(
      this.ordersRepository,
      paginationDto,
      { usuarioId },
    );
  }

  /**
   * Obtiene pedidos por usuario
   */
  async findByUsuario(usuarioId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { usuarioId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Crea un nuevo pedido
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  /**
   * Actualiza el estado de un pedido
   */
  async updateStatus(id: string, estado: OrderStatus): Promise<Order> {
    await this.findOne(id);
    await this.ordersRepository.update(id, { estado });
    return this.findOne(id);
  }

  /**
   * Actualiza un pedido
   */
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id);
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  /**
   * Cancela un pedido
   */
  async cancel(id: string): Promise<Order> {
    return this.updateStatus(id, OrderStatus.CANCELLED);
  }

  /**
   * Elimina un pedido
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.ordersRepository.delete(id);
  }
}
