import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Version
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

import { ReviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('products/:productId/reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get()
	@Version('1.0')
	@ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
	@ApiOperation({ summary: 'Get all reviews' })
	@ApiResponse({ status: 200, description: 'Return all reviews' })
	async findAllByProductId(@Param('productId', ParseIntPipe) productId: number) {
		return await this.reviewService.findAllByProductId(productId);
	}

	@Get(':reviewId')
	@Version('1.0')
	@ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
	@ApiParam({ name: 'reviewId', type: 'number', description: 'Review ID' })
	@ApiOperation({ summary: 'Get review by ID' })
	@ApiResponse({ status: 200, description: 'Return a review by ID' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 404, description: 'Review not found' })
	async findById(@Param('reviewId', ParseIntPipe) id: number) {
		return await this.reviewService.findById(id);
	}

	@Post()
	@Auth()
	@Version('1.0')
	@ApiBearerAuth('JWT-auth')
	@ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
	@ApiOperation({ summary: 'Create a new review' })
	@ApiResponse({ status: 201, description: 'Review created successfully' })
	@ApiResponse({ status: 400, description: 'Invalid request data' })
	async create(
		@CurrentUser('id') userId: number,
		@Param('productId', ParseIntPipe) productId: number,
		@Body() body: ReviewDto
	) {
		return await this.reviewService.create(userId, productId, body);
	}

	@Auth()
	@Patch(':reviewId')
	@Version('1.0')
	@ApiBearerAuth('JWT-auth')
	@ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
	@ApiParam({ name: 'reviewId', type: 'number', description: 'Review ID' })
	@ApiOperation({ summary: 'Update a review by ID' })
	@ApiResponse({ status: 200, description: 'Review updated successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 404, description: 'Review not found' })
	async update(@Param('reviewId', ParseIntPipe) id: number, @Body() body: ReviewDto) {
		return await this.reviewService.update(id, body);
	}

	@Auth()
	@Delete(':reviewId')
	@Version('1.0')
	@HttpCode(204)
	@ApiBearerAuth('JWT-auth')
	@ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
	@ApiParam({ name: 'reviewId', type: 'number', description: 'Review ID' })
	@ApiOperation({ summary: 'Delete a review by ID' })
	@ApiResponse({ status: 200, description: 'Review deleted successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 404, description: 'Review not found' })
	async delete(@Param('reviewId', ParseIntPipe) id: number) {
		await this.reviewService.delete(id);
	}
}
