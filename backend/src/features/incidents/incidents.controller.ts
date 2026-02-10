import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@ApiTags('Incidents')
@Controller('incidents')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @ApiOperation({ summary: 'Obtener todas las incidencias (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Incident>> {
    return this.incidentsService.findAllPaginated(paginationDto);
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
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Incident>> {
    return this.incidentsService.findByPedidoPaginated(pedidoId, paginationDto);
  }

  @ApiOperation({ summary: 'Crear incidencia' })
  @Post()
  async create(@Body() createDto: CreateIncidentDto): Promise<Incident> {
    return this.incidentsService.create(createDto);
  }

  @ApiOperation({ summary: 'Actualizar incidencia' })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateIncidentDto,
  ): Promise<Incident> {
    return this.incidentsService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Resolver incidencia (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id/resolve')
  async resolve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { resolucion: string },
  ): Promise<Incident> {
    return this.incidentsService.resolve(id, body.resolucion);
  }

  @ApiOperation({ summary: 'Eliminar incidencia (SUPERADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.incidentsService.delete(id);
  }
}
