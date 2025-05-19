import { Test, TestingModule } from '@nestjs/testing';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
	let controller: ProductController;
	let productService: ProductService;

	const mockProductService = {
		findById: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductController],
			providers: [
				{
					provide: ProductService,
					useValue: mockProductService
				}
			]
		}).compile();

		controller = module.get<ProductController>(ProductController);
		productService = module.get<ProductService>(ProductService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should call productService.findById with correct id', async () => {
			const productId = 1;
			const expectedProduct = { id: productId, name: 'Product 1', price: 100 };

			mockProductService.findById.mockResolvedValue(expectedProduct);

			const result = await controller.findAll(productId);

			expect(productService.findById).toHaveBeenCalledWith(productId);
			expect(result).toEqual(expectedProduct);
		});

		it('should throw an error if productService.findById throws an error', async () => {
			const productId = 999;
			const errorMessage = 'Product not found';

			mockProductService.findById.mockRejectedValue(new Error(errorMessage));

			await expect(controller.findAll(productId)).rejects.toThrow(errorMessage);
		});
	});
});
