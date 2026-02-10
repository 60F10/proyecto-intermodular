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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNote } from './entities/delivery-note.entity';

@ApiTags('Delivery Notes')
@Controller('delivery-notes')
@UseInterceptors(ClassSerializerInterceptor)
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @ApiOperation({ summary: 'Obtener todas las notas de entrega' })
  @Get()
  async findAll(): Promise<DeliveryNote[]> {
    return this.deliveryNotesService.findAll();
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
  ): Promise<DeliveryNote[]> {
    return this.deliveryNotesService.findByPedido(pedidoId);
  }

  @ApiOperation({ summary: 'Crear nota de entrega' })
  @Post()
  async create(@Body() createDto: Partial<DeliveryNote>): Promise<DeliveryNote> {
    return this.deliveryNotesService.create(createDto);
  }

  @ApiOperation({ summary: 'Actualizar nota de entrega' })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: Partial<DeliveryNote>,
  ): Promise<DeliveryNote> {
    return this.deliveryNotesService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Cambiar estado de entrega' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { estado: string },
  ): Promise<DeliveryNote> {
    return this.deliveryNotesService.updateStatus(id, body.estado as any);
  }
}
