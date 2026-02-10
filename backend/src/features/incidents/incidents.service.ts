import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentStatus } from './entities/incident.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { PaginationService } from '../../common/services/pagination.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentsRepository: Repository<Incident>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Incident>> {
    return this.paginationService.paginateRepository(
      this.incidentsRepository,
      paginationDto,
    );
  }

  async findAll(): Promise<Incident[]> {
    return this.incidentsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentsRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    return incident;
  }

  async findByPedidoPaginated(
    pedidoId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Incident>> {
    return this.paginationService.paginateRepository(
      this.incidentsRepository,
      paginationDto,
      { pedidoId },
    );
  }

  async findByPedido(pedidoId: string): Promise<Incident[]> {
    return this.incidentsRepository.find({
      where: { pedidoId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentsRepository.create(createDto);
    return this.incidentsRepository.save(incident);
  }

  async update(id: string, updateDto: UpdateIncidentDto): Promise<Incident> {
    await this.findOne(id);
    await this.incidentsRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, estado: IncidentStatus): Promise<Incident> {
    const updateDto: UpdateIncidentDto = { estado };
    return this.update(id, updateDto);
  }

  async resolve(id: string, resolucion: string): Promise<Incident> {
    const updateDto: UpdateIncidentDto = {
      estado: IncidentStatus.RESOLVED,
      resolucion,
    };
    return this.update(id, updateDto);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.incidentsRepository.delete(id);
  }
}
