import { Module } from '@nestjs/common';

import { OrderItemRepository } from './order-item.repository';
import { OrderItemService } from './order-item.service';

@Module({
	imports: [],
	controllers: [],
	providers: [OrderItemService, OrderItemRepository],
	exports: [OrderItemService, OrderItemRepository]
})
export class OrderItemModule {}
