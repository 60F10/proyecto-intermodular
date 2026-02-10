import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryNote, DeliveryStatus } from './entities/delivery-note.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { PaginationService } from '../../common/services/pagination.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';

@Injectable()
export class DeliveryNotesService {
  constructor(
    @InjectRepository(DeliveryNote)
    private readonly deliveryNotesRepository: Repository<DeliveryNote>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<DeliveryNote>> {
    return this.paginationService.paginateRepository(
      this.deliveryNotesRepository,
      paginationDto,
    );
  }

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

  async findByPedidoPaginated(
    pedidoId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<DeliveryNote>> {
    return this.paginationService.paginateRepository(
      this.deliveryNotesRepository,
      paginationDto,
      { pedidoId },
    );
  }

  async findByPedido(pedidoId: string): Promise<DeliveryNote[]> {
    return this.deliveryNotesRepository.find({
      where: { pedidoId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: CreateDeliveryNoteDto): Promise<DeliveryNote> {
    const note = this.deliveryNotesRepository.create(createDto);
    return this.deliveryNotesRepository.save(note);
  }

  async update(
    id: string,
    updateDto: UpdateDeliveryNoteDto,
  ): Promise<DeliveryNote> {
    await this.findOne(id);
    await this.deliveryNotesRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, estado: DeliveryStatus): Promise<DeliveryNote> {
    return this.update(id, { estado });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.deliveryNotesRepository.delete(id);
  }
}
