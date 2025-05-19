import { Test, TestingModule } from '@nestjs/testing';

import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

describe('ProductService', () => {
	let service: ProductService;
	let repository: jest.Mocked<ProductRepository>;

	beforeEach(async () => {
		const mockProductRepository = {
			findById: jest.fn()
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					provide: ProductRepository,
					useValue: mockProductRepository
				}
			]
		}).compile();

		service = module.get<ProductService>(ProductService);
		repository = module.get(ProductRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findById', () => {
		it('should call repository.findById with correct id', async () => {
			const id = 1;
			repository.findById.mockResolvedValue({
				id,
				name: 'Test Product',
				slug: 'test-product',
				description: 'Test Description',
				price: 100,
				imagesUrl: ['url1', 'url2'],
				createdAt: new Date(),
				updatedAt: new Date(),
				categoryId: 1,
				category: {
					id: 1,
					name: 'Test Category',
					slug: 'test-category',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			});

			await service.findById(id);

			expect(repository.findById).toHaveBeenCalledWith(id);
		});

		it('should return the product from repository', async () => {
			const id = 1;
			const expectedProduct = {
				id,
				name: 'Test Product',
				slug: 'test-product',
				description: 'Test Description',
				price: 100,
				imagesUrl: ['url1', 'url2'],
				createdAt: new Date(),
				updatedAt: new Date(),
				categoryId: 1,
				category: {
					id: 1,
					name: 'Test Category',
					slug: 'test-category',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			};
			repository.findById.mockResolvedValue(expectedProduct);

			const result = await service.findById(id);

			expect(result).toEqual(expectedProduct);
		});

		it('should return null when product is not found', async () => {
			const id = 999;
			repository.findById.mockResolvedValue(null);

			const result = await service.findById(id);

			expect(result).toBeNull();
		});
	});
});
