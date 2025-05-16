import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Version
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserDto } from '../user/user.dto';

import { FavoriteService } from './favorite.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@Controller('/users/me')
export class FavoritesController {
	constructor(private readonly favoriteService: FavoriteService) {}

	@Auth()
	@HttpCode(200)
	@Get('/favorites')
	@Version('1.0')
	@ApiOperation({ summary: 'Get user favorites by ID' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'Return user favorites' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async findFavorites(
		@CurrentUser('id') userId: number,
		@Query() paginationQuery: PaginationQueryDto
	) {
		return await this.favoriteService.getFavorites(userId, paginationQuery);
	}

	@Auth()
	@HttpCode(200)
	@Post('/favorites/:productId')
	@Version('1.0')
	@ApiOperation({ summary: 'Add to user favorites' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiBody({ type: UserDto, description: 'User data to update' })
	@ApiResponse({ status: 200, description: 'User favorites updated successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async addToFavorites(
		@CurrentUser('id') userId: number,
		@Param('productId', ParseIntPipe) productId: number
	) {
		return await this.favoriteService.addToFavorites(userId, productId);
	}

	@Auth()
	@HttpCode(204)
	@Delete('/favorites/:productId')
	@Version('1.0')
	@ApiOperation({ summary: 'Remove from user favorites' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiBody({ type: UserDto, description: 'User data to update' })
	@ApiResponse({ status: 200, description: 'User favorites updated successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async removeFromFavorites(
		@CurrentUser('id') userId: number,
		@Param('productId', ParseIntPipe) productId: number
	) {
		return await this.favoriteService.removeFromFavorites(userId, productId);
	}
}
