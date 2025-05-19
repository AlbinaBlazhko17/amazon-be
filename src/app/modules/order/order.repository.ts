import { Injectable } from '@nestjs/common';

import { OrderItem, OrderStatus } from '@prisma/client';

import { OrderItemService } from '../order-item/order-item.service';
import { ProductService } from '../product/product.service';

import { CreateOrderItemDto } from './interfaces/create-order-item.dto';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginationService } from '@/common/pagination/pagination.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrderRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService,
		private readonly productService: ProductService,
		private readonly orderItemService: OrderItemService
	) {}

	async findAll(paginationQueryDto: PaginationQueryDto) {
		return this.pagination.paginate(
			this.prisma.order,
			paginationQueryDto,
			{},
			{ createdAt: 'desc' },
			{},
			{
				user: true,
				orderItems: {
					include: {
						product: true
					}
				}
			}
		);
	}

	async findById(id: number) {
		return this.prisma.order.findUnique({
			where: { id },
			include: {
				user: true,
				items: {
					include: {
						product: true
					}
				}
			}
		});
	}

	async findByUserId(userId: number, paginationQueryDto: PaginationQueryDto) {
		return this.pagination.paginate(
			this.prisma.order,
			paginationQueryDto,
			{ where: { userId } },
			{ createdAt: 'desc' },
			{},
			{
				user: true,
				orderItems: {
					include: {
						product: true
					}
				}
			}
		);
	}

	async create(userId: number, orderItemsData: CreateOrderItemDto[]) {
		return this.prisma.$transaction(async prisma => {
			const order = await prisma.order.create({
				data: {
					userId,
					totalPrice: 0
				}
			});

			let totalOrderPrice = 0;

			for (const itemData of orderItemsData) {
				const product = await this.productService.findById(itemData.productId);

				if (!product) {
					throw new Error(`Product with ID ${itemData.productId} not found`);
				}

				const itemTotalPrice = product.price * itemData.quantity;
				totalOrderPrice += itemTotalPrice;

				await this.orderItemService.create(order.id, itemData.productId, itemData.quantity);
			}

			return prisma.order.update({
				where: { id: order.id },
				data: { totalPrice: totalOrderPrice },
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			});
		});
	}

	async update(id: number, items: OrderItem[]) {
		return this.prisma.order.update({
			where: { id },
			data: {
				items: {
					create: items
				}
			}
		});
	}

	async delete(id: number) {
		return this.prisma.order.delete({
			where: { id }
		});
	}

	async updateStatus(id: number, status: OrderStatus) {
		return this.prisma.order.update({
			where: { id },
			data: { status }
		});
	}
}
