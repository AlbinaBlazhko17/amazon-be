import { Injectable } from '@nestjs/common';

import { IFavoriteQuery } from './interfaces/favorite-query.interface';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '@/common/pagination/interfaces/paginated-result.interface';
import { PaginationService } from '@/common/pagination/pagination.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FavoriteRepository {
	private readonly userFavoriteSelectFields = {
		product: {
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				imagesUrl: true,
				category: {
					select: {
						id: true,
						name: true
					}
				}
			}
		}
	};

	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService
	) {}

	async addToFavorites(userId: number, productId: number) {
		return await this.prisma.userFavorite.create({
			data: {
				userId,
				productId
			},
			select: {
				...this.userFavoriteSelectFields
			}
		});
	}

	async removeFromFavorites(userId: number, productId: number): Promise<void> {
		await this.prisma.userFavorite.deleteMany({
			where: {
				userId,
				productId
			}
		});
	}

	async getUserFavorites(userId: number): Promise<IFavoriteQuery[]> {
		return await this.prisma.userFavorite.findMany({
			where: {
				userId
			},
			select: {
				...this.userFavoriteSelectFields
			}
		});
	}

	async getUserPaginatedFavorites(
		userId: number,
		paginationQueryDto: PaginationQueryDto
	): Promise<PaginatedResult<IFavoriteQuery>> {
		return await this.pagination.paginate(
			this.prisma.userFavorite,
			paginationQueryDto,
			{ userId },
			{ addedAt: 'desc' },
			{},
			{
				...this.userFavoriteSelectFields
			}
		);
	}
}
