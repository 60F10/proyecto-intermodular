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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderWithItemsDto } from './dto/create-order-with-items.dto';

@ApiTags('Orders')
@ApiBearerAuth('jwt')
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Obtener todos los pedidos con paginación' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Order>> {
    return this.ordersService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Obtener pedido por ID' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
  @UseGuards(JwtAuthGuard)
  @Get('usuario/:usuarioId')
  async findByUsuario(
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Order>> {
    return this.ordersService.findByUsuarioPaginated(usuarioId, paginationDto);
  }

  @ApiOperation({ summary: 'Crear nuevo pedido' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Crear pedido con items (transaccional)' })
  @UseGuards(JwtAuthGuard)
  @Post('with-items')
  async createWithItems(
    @Body() createOrderWithItemsDto: CreateOrderWithItemsDto,
  ): Promise<Order> {
    const { items, ...orderData } = createOrderWithItemsDto;
    return this.ordersService.createWithItems(orderData, items);
  }

  @ApiOperation({ summary: 'Actualizar pedido' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Cambiar estado del pedido (ADMIN)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { estado: OrderStatus },
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, body.estado);
  }

  @ApiOperation({ summary: 'Cancelar pedido' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Order> {
    return this.ordersService.cancel(id);
  }

  @ApiOperation({ summary: 'Eliminar pedido (SUPERADMIN)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.ordersService.delete(id);
  }
}
