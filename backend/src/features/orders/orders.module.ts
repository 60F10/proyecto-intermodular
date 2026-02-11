import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController, OrderItemsController],
  providers: [OrdersService, OrderItemsService, PaginationService],
  exports: [OrdersService, OrderItemsService],
})
export class OrdersModule {}
