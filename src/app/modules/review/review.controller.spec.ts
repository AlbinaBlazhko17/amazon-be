import { Test, TestingModule } from '@nestjs/testing';

import { ReviewController } from './review.controller';
import { ReviewDto } from './review.dto';
import { ReviewService } from './review.service';

describe('ReviewController', () => {
	let controller: ReviewController;
	let reviewService: ReviewService;

	const mockReviewService = {
		findAllByProductId: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	const paginationQueryDto = {
		skip: 1,
		take: 2
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReviewController],
			providers: [
				{
					provide: ReviewService,
					useValue: mockReviewService
				}
			]
		}).compile();

		controller = module.get<ReviewController>(ReviewController);
		reviewService = module.get<ReviewService>(ReviewService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAllByProductId', () => {
		it('should return an array of reviews for a product', async () => {
			const productId = 1;
			const reviews = [{ id: 1, text: 'Great product', rating: 5 }];
			mockReviewService.findAllByProductId.mockResolvedValue(reviews);

			const result = await controller.findAllByProductId(productId, paginationQueryDto);

			expect(result).toEqual(reviews);
			expect(reviewService.findAllByProductId).toHaveBeenCalledWith(productId, paginationQueryDto);
		});
	});

	describe('findById', () => {
		it('should return a review by id', async () => {
			const reviewId = 1;
			const review = { id: reviewId, text: 'Great product', rating: 5 };
			mockReviewService.findById.mockResolvedValue(review);

			const result = await controller.findById(reviewId);

			expect(result).toEqual(review);
			expect(reviewService.findById).toHaveBeenCalledWith(reviewId);
		});
	});

	describe('create', () => {
		it('should create a new review', async () => {
			const userId = 1;
			const productId = 2;
			const reviewDto: ReviewDto = { text: 'Great product', rating: 5 };
			const newReview = { id: 1, ...reviewDto };
			mockReviewService.create.mockResolvedValue(newReview);

			const result = await controller.create(userId, productId, reviewDto);

			expect(result).toEqual(newReview);
			expect(reviewService.create).toHaveBeenCalledWith(userId, productId, reviewDto);
		});
	});

	describe('update', () => {
		it('should update a review', async () => {
			const reviewId = 1;
			const reviewDto: ReviewDto = { text: 'Updated review', rating: 4 };
			const updatedReview = { id: reviewId, ...reviewDto };
			mockReviewService.update.mockResolvedValue(updatedReview);

			const result = await controller.update(reviewId, reviewDto);

			expect(result).toEqual(updatedReview);
			expect(reviewService.update).toHaveBeenCalledWith(reviewId, reviewDto);
		});
	});

	describe('delete', () => {
		it('should delete a review', async () => {
			const reviewId = 1;
			mockReviewService.delete.mockResolvedValue(undefined);

			await controller.delete(reviewId);

			expect(reviewService.delete).toHaveBeenCalledWith(reviewId);
		});
	});
});
