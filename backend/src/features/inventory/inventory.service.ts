import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement, InventoryMovementType } from './entities/inventory-movement.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { PaginationService } from '../../common/services/pagination.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementsRepository: Repository<InventoryMovement>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<InventoryMovement>> {
    return this.paginationService.paginateRepository(
      this.movementsRepository,
      paginationDto,
    );
  }

  async findAll(): Promise<InventoryMovement[]> {
    return this.movementsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<InventoryMovement> {
    const movement = await this.movementsRepository.findOne({
      where: { id },
    });

    if (!movement) {
      throw new NotFoundException(`Movimiento de inventario con ID ${id} no encontrado`);
    }

    return movement;
  }

  async findByProductoPaginated(
    productoId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<InventoryMovement>> {
    return this.paginationService.paginateRepository(
      this.movementsRepository,
      paginationDto,
      { productoId },
    );
  }

  async findByProducto(productoId: string): Promise<InventoryMovement[]> {
    return this.movementsRepository.find({
      where: { productoId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: Partial<InventoryMovement>): Promise<InventoryMovement> {
    const movement = this.movementsRepository.create(createDto);
    return this.movementsRepository.save(movement);
  }

  async recordEntry(
    productoId: string,
    cantidad: number,
    motivo: string,
    usuarioId?: string,
  ): Promise<InventoryMovement> {
    return this.create({
      productoId,
      cantidad,
      motivo,
      tipo: InventoryMovementType.ENTRY,
      usuarioId,
    });
  }

  async recordExit(
    productoId: string,
    cantidad: number,
    motivo: string,
    usuarioId?: string,
  ): Promise<InventoryMovement> {
    return this.create({
      productoId,
      cantidad: -cantidad,
      motivo,
      tipo: InventoryMovementType.EXIT,
      usuarioId,
    });
  }

  async recordAdjustment(
    productoId: string,
    cantidad: number,
    motivo: string,
    usuarioId?: string,
  ): Promise<InventoryMovement> {
    return this.create({
      productoId,
      cantidad,
      motivo,
      tipo: InventoryMovementType.ADJUSTMENT,
      usuarioId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.movementsRepository.delete(id);
  }
}
