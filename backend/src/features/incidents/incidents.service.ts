import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentStatus } from './entities/incident.entity';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentsRepository: Repository<Incident>,
  ) {}

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

  async findByPedido(pedidoId: string): Promise<Incident[]> {
    return this.incidentsRepository.find({
      where: { pedidoId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: Partial<Incident>): Promise<Incident> {
    const incident = this.incidentsRepository.create(createDto);
    return this.incidentsRepository.save(incident);
  }

  async update(id: string, updateDto: Partial<Incident>): Promise<Incident> {
    await this.findOne(id);
    await this.incidentsRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, estado: IncidentStatus): Promise<Incident> {
    return this.update(id, { estado });
  }

  async resolve(id: string, resolucion: string): Promise<Incident> {
    return this.update(id, {
      estado: IncidentStatus.RESOLVED,
      resolucion,
    });
  }
}
