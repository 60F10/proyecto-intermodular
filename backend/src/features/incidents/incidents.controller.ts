import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';

@ApiTags('Incidents')
@Controller('incidents')
@UseInterceptors(ClassSerializerInterceptor)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @ApiOperation({ summary: 'Obtener todas las incidencias' })
  @Get()
  async findAll(): Promise<Incident[]> {
    return this.incidentsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener incidencia por ID' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Incident> {
    return this.incidentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener incidencias de un pedido' })
  @Get('pedido/:pedidoId')
  async findByPedido(
    @Param('pedidoId', new ParseUUIDPipe()) pedidoId: string,
  ): Promise<Incident[]> {
    return this.incidentsService.findByPedido(pedidoId);
  }

  @ApiOperation({ summary: 'Crear incidencia' })
  @Post()
  async create(@Body() createDto: Partial<Incident>): Promise<Incident> {
    return this.incidentsService.create(createDto);
  }

  @ApiOperation({ summary: 'Actualizar incidencia' })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: Partial<Incident>,
  ): Promise<Incident> {
    return this.incidentsService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Resolver incidencia' })
  @Patch(':id/resolve')
  async resolve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { resolucion: string },
  ): Promise<Incident> {
    return this.incidentsService.resolve(id, body.resolucion);
  }
}
