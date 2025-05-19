import { Test, TestingModule } from '@nestjs/testing';

import { ProductController } from './product.controller';
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

describe('ProductController', () => {
	let controller: ProductController;
	let service: ProductService;

	const mockProductService = {
		findAll: jest.fn(),
		findById: jest.fn(),
		findBySlug: jest.fn(),
		findByCategoryId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
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
		service = module.get<ProductService>(ProductService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should call productService.findAll with pagination params', async () => {
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: {} };

			mockProductService.findAll.mockResolvedValue(expectedResult);

			const result = await controller.findAll(paginationQueryDto);

			expect(service.findAll).toHaveBeenCalledWith(paginationQueryDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findById', () => {
		it('should call productService.findById with correct id', async () => {
			const id = 1;
			const expectedResult = { id, name: 'Product 1' };

			mockProductService.findById.mockResolvedValue(expectedResult);

			const result = await controller.findById(id);

			expect(service.findById).toHaveBeenCalledWith(id);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findBySlug', () => {
		it('should call productService.findBySlug with correct slug', async () => {
			const slug = 'product-1';
			const expectedResult = { id: 1, slug, name: 'Product 1' };

			mockProductService.findBySlug.mockResolvedValue(expectedResult);

			const result = await controller.findBySlug(slug);

			expect(service.findBySlug).toHaveBeenCalledWith(slug);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findByCategoryId', () => {
		it('should call productService.findByCategoryId with correct categoryId and pagination', async () => {
			const categoryId = 1;
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: {} };

			mockProductService.findByCategoryId.mockResolvedValue(expectedResult);

			const result = await controller.findByCategoryId(categoryId, paginationQueryDto);

			expect(service.findByCategoryId).toHaveBeenCalledWith(categoryId, paginationQueryDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('create', () => {
		it('should call productService.create with product data', async () => {
			const productDto: Required<ProductDto> = {
				name: 'New Product',
				description: 'Description',
				price: 99.99,
				imagesUrl: ['image1.jpg'],
				categoryId: 1
			};
			const expectedResult = { id: 1, ...productDto };

			mockProductService.create.mockResolvedValue(expectedResult);

			const result = await controller.create(productDto);

			expect(service.create).toHaveBeenCalledWith(productDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('update', () => {
		it('should call productService.update with id and product data', async () => {
			const id = 1;
			const productDto: ProductDto = { name: 'Updated Product', categoryId: 1 };
			const expectedResult = { id, ...productDto };

			mockProductService.update.mockResolvedValue(expectedResult);

			const result = await controller.update(id, productDto);

			expect(service.update).toHaveBeenCalledWith(id, productDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('delete', () => {
		it('should call productService.delete with correct id', async () => {
			const id = 1;

			mockProductService.delete.mockResolvedValue(undefined);

			await controller.delete(id);

			expect(service.delete).toHaveBeenCalledWith(id);
		});
	});
});
