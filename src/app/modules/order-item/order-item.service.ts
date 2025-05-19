import { Injectable } from '@nestjs/common';

import { OrderItemRepository } from './order-item.repository';

@Injectable()
export class OrderItemService {
	constructor(private readonly orderItemRepository: OrderItemRepository) {}

	async findById(id: number) {
		return await this.orderItemRepository.findById(id);
	}

	async create(orderId: number, productId: number, quantity: number) {
		return await this.orderItemRepository.create(orderId, productId, quantity);
	}
}
