import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ReviewRepository {
	private readonly reviewSelectFields: Prisma.ReviewSelect = {
		id: true,
		rating: true,
		text: true,
		createdAt: true,
		updatedAt: true,
		user: {
			select: {
				id: true,
				name: true,
				email: true,
				avatarUrl: true
			}
		},
		product: {
			select: {
				id: true,
				name: true,
				slug: true
			}
		}
	};

	constructor(private readonly prisma: PrismaService) {}

	async findAllByProductId(productId: number) {
		return await this.prisma.review.findMany({
			where: { productId },

			select: {
				...this.reviewSelectFields
			}
		});
	}

	async findById(id: number) {
		return await this.prisma.review.findUnique({
			where: { id },
			select: {
				...this.reviewSelectFields
			}
		});
	}

	async create(data: Prisma.ReviewCreateInput) {
		return await this.prisma.review.create({
			data,
			select: {
				...this.reviewSelectFields
			}
		});
	}

	async update(id: number, data: Prisma.ReviewUpdateInput) {
		return await this.prisma.review.update({
			where: { id },
			data,
			select: {
				...this.reviewSelectFields
			}
		});
	}

	async delete(id: number) {
		return await this.prisma.review.delete({
			where: { id },
			select: {
				...this.reviewSelectFields
			}
		});
	}
}
