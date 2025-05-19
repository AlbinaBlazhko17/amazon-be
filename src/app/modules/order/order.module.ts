import { Module } from '@nestjs/common';

import { OrderItemModule } from '../order-item/order-item.module';
import { OrderItemService } from '../order-item/order-item.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';

import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { PaginationModule } from '@/common/pagination/pagination.module';
import { PaginationService } from '@/common/pagination/pagination.service';

@Module({
	imports: [PaginationModule, ProductModule, OrderItemModule],
	controllers: [OrderController],
	providers: [OrderService, OrderRepository, ProductService, PaginationService, OrderItemService]
})
export class OrderModule {}
