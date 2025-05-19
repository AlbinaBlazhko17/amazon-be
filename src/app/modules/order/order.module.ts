import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
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
	imports: [PaginationModule, ProductModule, OrderItemModule, CategoryModule],
	controllers: [OrderController],
	providers: [
		OrderService,
		OrderRepository,
		ProductService,
		PaginationService,
		OrderItemService,
		CategoryService
	]
})
export class OrderModule {}
