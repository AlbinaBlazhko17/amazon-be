import { Injectable, NotFoundException } from '@nestjs/common';

import { UserService } from '../user/user.service';

import { FavoriteRepository } from './favorite.repository';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@Injectable()
export class FavoriteService {
	constructor(
		private readonly userService: UserService,
		private readonly favoriteRepository: FavoriteRepository
	) {}

	async addToFavorites(userId: number, productId: number) {
		const user = await this.userService.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const existingFavorites = await this.favoriteRepository.getUserFavorites(userId);

		const isAlreadyFavorite = existingFavorites.some(favorite => favorite.product.id === productId);

		if (isAlreadyFavorite) {
			throw new NotFoundException('Product is already in favorites');
		}

		const favorite = await this.favoriteRepository.addToFavorites(userId, productId);

		return favorite.product;
	}

	async removeFromFavorites(userId: number, productId: number) {
		const user = await this.userService.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.favoriteRepository.removeFromFavorites(userId, productId);
	}

	async getFavorites(userId: number, paginationQueryDto: PaginationQueryDto) {
		const user = await this.userService.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const favorites = await this.favoriteRepository.getUserPaginatedFavorites(
			userId,
			paginationQueryDto
		);

		const mappedFavorites = favorites.data.map(favorite => ({
			...favorite.product
		}));

		return {
			data: mappedFavorites,
			meta: favorites.meta
		};
	}
}
