import { Injectable, NotFoundException } from '@nestjs/common';

import { ReviewDto } from './review.dto';
import { ReviewRepository } from './review.repository';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@Injectable()
export class ReviewService {
	constructor(private readonly reviewRepository: ReviewRepository) {}

	async findAllByProductId(productId: number, paginationQueryDto: PaginationQueryDto) {
		return await this.reviewRepository.findAllByProductId(productId, paginationQueryDto);
	}

	async findById(id: number) {
		const review = await this.reviewRepository.findById(id);

		if (!review) {
			throw new NotFoundException('Review not found');
		}

		return review;
	}

	async create(userId: number, productId: number, data: ReviewDto) {
		const newReview = {
			...data,
			userId,
			productId
		};

		return await this.reviewRepository.create(newReview);
	}

	async update(id: number, data: ReviewDto) {
		const existingReview = await this.reviewRepository.findById(id);

		if (!existingReview) {
			throw new NotFoundException('Review not found');
		}

		return await this.reviewRepository.update(id, data);
	}

	async delete(id: number) {
		const existingReview = await this.reviewRepository.findById(id);

		if (!existingReview) {
			throw new NotFoundException('Review not found');
		}

		return await this.reviewRepository.delete(id);
	}
}
