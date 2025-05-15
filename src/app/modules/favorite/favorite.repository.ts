import { Injectable } from '@nestjs/common';

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

	constructor(private readonly prisma: PrismaService) {}

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

	async getUserFavorites(userId: number) {
		return this.prisma.userFavorite.findMany({
			where: {
				userId
			},
			select: {
				...this.userFavoriteSelectFields
			}
		});
	}
}
