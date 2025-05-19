import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrderItemRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number) {
		return await this.prisma.orderItem.findUnique({
			where: { id },
			include: {
				product: true
			}
		});
	}

	async create(orderId: number, productId: number, quantity: number) {
		return await this.prisma.orderItem.create({
			data: {
				orderId,
				productId,
				quantity
			}
		});
	}
}
