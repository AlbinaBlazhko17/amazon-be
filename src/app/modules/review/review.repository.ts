import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginationService } from '@/common/pagination/pagination.service';
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

	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService
	) {}

	async findAllByProductId(productId: number, paginationQueryDto: PaginationQueryDto) {
		return await this.pagination.paginate(
			this.prisma.review,
			paginationQueryDto,
			{ productId },
			{ createdAt: 'desc' },
			{},
			{
				...this.reviewSelectFields
			}
		);
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
		return await this.prisma.$transaction(async tx => {
			const review = await tx.review.create({
				data,
				select: {
					...this.reviewSelectFields
				}
			});

			if (data.product?.connect?.id) {
				await this.updateProductRating(tx, data.product.connect.id);
			}

			return review;
		});
	}

	async update(id: number, data: Prisma.ReviewUpdateInput) {
		return await this.prisma.$transaction(async tx => {
			const currentReview = await tx.review.findUnique({
				where: { id },
				select: { productId: true }
			});

			const updatedReview = await tx.review.update({
				where: { id },
				data,
				select: {
					...this.reviewSelectFields
				}
			});

			if (currentReview?.productId) {
				await this.updateProductRating(tx, currentReview.productId);
			}

			return updatedReview;
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

	private async updateProductRating(tx: Prisma.TransactionClient, productId: number) {
		const stats = await tx.review.aggregate({
			where: { productId },
			_avg: { rating: true },
			_count: { rating: true }
		});

		const averageRating = stats._avg.rating || 0;
		const reviewsCount = stats._count.rating || 0;

		await tx.product.update({
			where: { id: productId },
			data: {
				averageRating: Number(averageRating.toFixed(2)),
				reviewsCount
			}
		});
	}

	async recalculateProductRating(productId: number) {
		return await this.prisma.$transaction(async tx => {
			await this.updateProductRating(tx, productId);
		});
	}

	async recalculateAllProductRatings() {
		const products = await this.prisma.product.findMany({
			select: { id: true }
		});

		for (const product of products) {
			await this.recalculateProductRating(product.id);
		}
	}
}
