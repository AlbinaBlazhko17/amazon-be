import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';

import { OrderItemService } from './order-item.service';

@Module({
	imports: [ProductModule, OrderModule],
	controllers: [],
	providers: [OrderItemService, ProductService, OrderService]
})
export class OrderItemModule {}
