import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number) {
		return this.prisma.product.findUnique({
			where: { id },
			include: {
				category: true
			}
		});
	}
}
