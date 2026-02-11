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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNote } from './entities/delivery-note.entity';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';

@ApiTags('Delivery Notes')
@ApiBearerAuth('jwt')
@Controller('delivery-notes')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @ApiOperation({ summary: 'Obtener todas las notas de entrega (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<DeliveryNote>> {
    return this.deliveryNotesService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Obtener nota de entrega por ID' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DeliveryNote> {
    return this.deliveryNotesService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener notas de entrega de un pedido' })
  @Get('pedido/:pedidoId')
  async findByPedido(
    @Param('pedidoId', new ParseUUIDPipe()) pedidoId: string,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<DeliveryNote>> {
    return this.deliveryNotesService.findByPedidoPaginated(
      pedidoId,
      paginationDto,
    );
  }

  @ApiOperation({ summary: 'Crear nota de entrega (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post()
  async create(@Body() createDto: CreateDeliveryNoteDto): Promise<DeliveryNote> {
    return this.deliveryNotesService.create(createDto);
  }

  @ApiOperation({ summary: 'Actualizar nota de entrega (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateDeliveryNoteDto,
  ): Promise<DeliveryNote> {
    return this.deliveryNotesService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Cambiar estado de entrega (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { estado: string },
  ): Promise<DeliveryNote> {
    return this.deliveryNotesService.updateStatus(id, body.estado as any);
  }

  @ApiOperation({ summary: 'Eliminar nota de entrega (SUPERADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deliveryNotesService.delete(id);
  }
}
