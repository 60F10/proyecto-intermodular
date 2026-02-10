import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement, InventoryMovementType } from './entities/inventory-movement.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementsRepository: Repository<InventoryMovement>,
  ) {}

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
}
