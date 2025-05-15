import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ReviewDto } from './review.dto';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	const mockReviewRepository = {
		findAllByProductId: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{
					provide: ReviewRepository,
					useValue: mockReviewRepository
				}
			]
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAllByProductId', () => {
		it('should return all reviews for a product ID', async () => {
			const productId = 1;
			const reviews = [{ id: 1, rating: 5, text: 'Great product' }];
			mockReviewRepository.findAllByProductId.mockResolvedValue(reviews);

			const result = await service.findAllByProductId(productId);

			expect(result).toEqual(reviews);
			expect(mockReviewRepository.findAllByProductId).toHaveBeenCalledWith(productId);
		});
	});

	describe('findById', () => {
		it('should return a review by ID', async () => {
			const id = 1;
			const review = { id, rating: 5, text: 'Great product' };
			mockReviewRepository.findById.mockResolvedValue(review);

			const result = await service.findById(id);

			expect(result).toEqual(review);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
		});

		it('should throw NotFoundException if review not found', async () => {
			const id = 999;
			mockReviewRepository.findById.mockResolvedValue(null);

			await expect(service.findById(id)).rejects.toThrow(NotFoundException);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
		});
	});

	describe('create', () => {
		it('should create a new review', async () => {
			const userId = 1;
			const productId = 2;
			const reviewDto: ReviewDto = { rating: 4, text: 'Good product' };
			const newReview = { ...reviewDto, userId, productId, id: 1 };

			mockReviewRepository.create.mockResolvedValue(newReview);

			const result = await service.create(userId, productId, reviewDto);

			expect(result).toEqual(newReview);
			expect(mockReviewRepository.create).toHaveBeenCalledWith({
				...reviewDto,
				userId,
				productId
			});
		});
	});

	describe('update', () => {
		it('should update an existing review', async () => {
			const id = 1;
			const reviewDto: ReviewDto = { rating: 3, text: 'Updated review' };
			const updatedReview = { id, ...reviewDto };

			mockReviewRepository.findById.mockResolvedValue({ id });
			mockReviewRepository.update.mockResolvedValue(updatedReview);

			const result = await service.update(id, reviewDto);

			expect(result).toEqual(updatedReview);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
			expect(mockReviewRepository.update).toHaveBeenCalledWith(id, reviewDto);
		});

		it('should throw NotFoundException if review to update not found', async () => {
			const id = 999;
			const reviewDto: ReviewDto = { rating: 3, text: 'Updated review' };

			mockReviewRepository.findById.mockResolvedValue(null);

			await expect(service.update(id, reviewDto)).rejects.toThrow(NotFoundException);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
			expect(mockReviewRepository.update).not.toHaveBeenCalled();
		});
	});

	describe('delete', () => {
		it('should delete an existing review', async () => {
			const id = 1;
			const deletedReview = { id, rating: 5, text: 'Great product' };

			mockReviewRepository.findById.mockResolvedValue(deletedReview);
			mockReviewRepository.delete.mockResolvedValue(deletedReview);

			const result = await service.delete(id);

			expect(result).toEqual(deletedReview);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
			expect(mockReviewRepository.delete).toHaveBeenCalledWith(id);
		});

		it('should throw NotFoundException if review to delete not found', async () => {
			const id = 999;

			mockReviewRepository.findById.mockResolvedValue(null);

			await expect(service.delete(id)).rejects.toThrow(NotFoundException);
			expect(mockReviewRepository.findById).toHaveBeenCalledWith(id);
			expect(mockReviewRepository.delete).not.toHaveBeenCalled();
		});
	});
});
