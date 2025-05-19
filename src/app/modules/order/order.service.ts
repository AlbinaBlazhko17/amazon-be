import { Injectable } from '@nestjs/common';

import { OrderStatus } from '@prisma/client';

import { CreateOrderItemDto } from './interfaces/create-order-item.dto';
import { OrderRepository } from './order.repository';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@Injectable()
export class OrderService {
	constructor(private readonly orderRepository: OrderRepository) {}

	async findAll(paginationQueryDto: PaginationQueryDto) {
		return this.orderRepository.findAll(paginationQueryDto);
	}

	async findById(id: number) {
		return this.orderRepository.findById(id);
	}

	async findByUserId(userId: number, paginationQueryDto: PaginationQueryDto) {
		return this.orderRepository.findByUserId(userId, paginationQueryDto);
	}

	async create(userId: number, orderItemsData: CreateOrderItemDto[]) {
		return this.orderRepository.create(userId, orderItemsData);
	}

	async delete(id: number) {
		return this.orderRepository.delete(id);
	}

	async updateStatus(id: number, status: OrderStatus) {
		return this.orderRepository.updateStatus(id, status);
	}
}
