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
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [Order],
  })
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: Order,
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
  @Get('usuario/:usuarioId')
  async findByUsuario(
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
  ): Promise<Order[]> {
    return this.ordersService.findByUsuario(usuarioId);
  }

  @ApiOperation({ summary: 'Crear nuevo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido creado',
    type: Order,
  })
  @Post()
  async create(@Body() createOrderDto: Partial<Order>): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Actualizar pedido' })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Cambiar estado del pedido' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { estado: OrderStatus },
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, body.estado);
  }

  @ApiOperation({ summary: 'Cancelar pedido' })
  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Order> {
    return this.ordersService.cancel(id);
  }
}
