import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
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
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@ApiTags('Order Items')
@Controller('order-items')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({ summary: 'Crear item de pedido' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post()
  async create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @ApiOperation({ summary: 'Obtener todos los items' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener item por ID' })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener items de un pedido' })
  @Get('pedido/:orderId')
  async findByOrderId(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<OrderItem[]> {
    return this.orderItemsService.findByOrderId(orderId);
  }

  @ApiOperation({ summary: 'Actualizar item de pedido' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @ApiOperation({ summary: 'Eliminar item de pedido' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.orderItemsService.delete(id);
  }
}
