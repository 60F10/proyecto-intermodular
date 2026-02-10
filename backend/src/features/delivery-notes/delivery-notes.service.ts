import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryNote, DeliveryStatus } from './entities/delivery-note.entity';

@Injectable()
export class DeliveryNotesService {
  constructor(
    @InjectRepository(DeliveryNote)
    private readonly deliveryNotesRepository: Repository<DeliveryNote>,
  ) {}

  async findAll(): Promise<DeliveryNote[]> {
    return this.deliveryNotesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DeliveryNote> {
    const note = await this.deliveryNotesRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Nota de entrega con ID ${id} no encontrada`);
    }

    return note;
  }

  async findByPedido(pedidoId: string): Promise<DeliveryNote[]> {
    return this.deliveryNotesRepository.find({
      where: { pedidoId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: Partial<DeliveryNote>): Promise<DeliveryNote> {
    const note = this.deliveryNotesRepository.create(createDto);
    return this.deliveryNotesRepository.save(note);
  }

  async update(id: string, updateDto: Partial<DeliveryNote>): Promise<DeliveryNote> {
    await this.findOne(id);
    await this.deliveryNotesRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, estado: DeliveryStatus): Promise<DeliveryNote> {
    return this.update(id, { estado });
  }
}
