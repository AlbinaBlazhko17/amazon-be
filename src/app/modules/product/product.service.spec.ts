import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryService } from '../category/category.service';

import { ProductDto } from './product.dto';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

describe('ProductService', () => {
	let service: ProductService;

	const mockProductRepository = {
		findAllPaginated: jest.fn(),
		findById: jest.fn(),
		findBySlug: jest.fn(),
		findByCategoryId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	const mockCategoryService = {
		findById: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					provide: ProductRepository,
					useValue: mockProductRepository
				},
				{
					provide: CategoryService,
					useValue: mockCategoryService
				}
			]
		}).compile();

		service = module.get<ProductService>(ProductService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should return all products with pagination', async () => {
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = {
				items: [],
				meta: { totalItems: 0, itemsPerPage: 10, totalPages: 0, currentPage: 1 }
			};

			mockProductRepository.findAllPaginated.mockResolvedValue(expectedResult);

			const result = await service.findAll(paginationQueryDto);

			expect(mockProductRepository.findAllPaginated).toHaveBeenCalledWith(paginationQueryDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findById', () => {
		it('should return a product by id', async () => {
			const productId = 1;
			const expectedProduct = { id: productId, name: 'Product 1' };

			mockProductRepository.findById.mockResolvedValue(expectedProduct);

			const result = await service.findById(productId);

			expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
			expect(result).toEqual(expectedProduct);
		});

		it('should throw NotFoundException if product not found', async () => {
			const productId = 999;

			mockProductRepository.findById.mockResolvedValue(null);

			await expect(service.findById(productId)).rejects.toThrow(
				new NotFoundException(`Product with id ${productId} not found`)
			);
		});
	});

	describe('findBySlug', () => {
		it('should return a product by slug', async () => {
			const slug = 'product-1';
			const expectedProduct = { id: 1, slug, name: 'Product 1' };

			mockProductRepository.findBySlug.mockResolvedValue(expectedProduct);

			const result = await service.findBySlug(slug);

			expect(mockProductRepository.findBySlug).toHaveBeenCalledWith(slug);
			expect(result).toEqual(expectedProduct);
		});

		it('should throw NotFoundException if product not found by slug', async () => {
			const slug = 'non-existent-product';

			mockProductRepository.findBySlug.mockResolvedValue(null);

			await expect(service.findBySlug(slug)).rejects.toThrow(
				new NotFoundException(`Product with slug ${slug} not found`)
			);
		});
	});

	describe('findByCategoryId', () => {
		it('should return products by category id', async () => {
			const categoryId = 1;
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = {
				items: [],
				meta: { totalItems: 0, itemsPerPage: 10, totalPages: 0, currentPage: 1 }
			};

			mockProductRepository.findByCategoryId.mockResolvedValue(expectedResult);

			const result = await service.findByCategoryId(categoryId, paginationQueryDto);

			expect(mockProductRepository.findByCategoryId).toHaveBeenCalledWith(
				categoryId,
				paginationQueryDto
			);
			expect(result).toEqual(expectedResult);
		});

		it('should throw NotFoundException if products not found for category', async () => {
			const categoryId = 999;
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };

			mockProductRepository.findByCategoryId.mockResolvedValue(null);

			await expect(service.findByCategoryId(categoryId, paginationQueryDto)).rejects.toThrow(
				new NotFoundException(`Product with category id ${categoryId} not found`)
			);
		});
	});

	describe('create', () => {
		it('should create a product', async () => {
			const productDto: Required<ProductDto> = {
				name: 'New Product',
				description: 'Description',
				price: 100,
				imagesUrl: ['image.jpg'],
				categoryId: 1
			};

			const category = { id: 1, name: 'Category 1' };
			const createdProduct = { id: 1, ...productDto, slug: 'new-product' };

			mockCategoryService.findById.mockResolvedValue(category);
			mockProductRepository.findBySlug.mockResolvedValue(null);
			mockProductRepository.create.mockResolvedValue(createdProduct);

			const result = await service.create(productDto);

			expect(mockCategoryService.findById).toHaveBeenCalledWith(productDto.categoryId);
			expect(mockProductRepository.findBySlug).toHaveBeenCalledWith('new-product');
			expect(mockProductRepository.create).toHaveBeenCalledWith({
				...productDto,
				slug: 'new-product'
			});
			expect(result).toEqual(createdProduct);
		});

		it('should throw NotFoundException if category not found', async () => {
			const productDto: Required<ProductDto> = {
				name: 'New Product',
				description: 'Description',
				price: 100,
				imagesUrl: ['image.jpg'],
				categoryId: 999
			};

			mockCategoryService.findById.mockResolvedValue(null);

			await expect(service.create(productDto)).rejects.toThrow(
				new NotFoundException(`Category with id ${productDto.categoryId} not found`)
			);
		});

		it('should throw BadRequestException if product with same name exists', async () => {
			const productDto: Required<ProductDto> = {
				name: 'Existing Product',
				description: 'Description',
				price: 100,
				imagesUrl: ['image.jpg'],
				categoryId: 1
			};

			const category = { id: 1, name: 'Category 1' };
			const existingProduct = { id: 1, ...productDto, slug: 'existing-product' };

			mockCategoryService.findById.mockResolvedValue(category);
			mockProductRepository.findBySlug.mockResolvedValue(existingProduct);

			await expect(service.create(productDto)).rejects.toThrow(
				new BadRequestException(`Product with name ${productDto.name} already exists`)
			);
		});
	});

	describe('update', () => {
		it('should update a product', async () => {
			const productId = 1;
			const productDto: Omit<ProductDto, 'slug'> = {
				name: 'Updated Product',
				description: 'Updated Description',
				price: 150,
				imagesUrl: ['updated-image.jpg'],
				categoryId: 1
			};

			const existingProduct = { id: productId, name: 'Old Product', slug: 'old-product' };
			const updatedProduct = { id: productId, ...productDto, slug: 'updated-product' };

			mockProductRepository.findById.mockResolvedValue(existingProduct);
			mockProductRepository.update.mockResolvedValue(updatedProduct);

			const result = await service.update(productId, productDto);

			expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
			expect(mockProductRepository.update).toHaveBeenCalledWith(productId, {
				...productDto,
				slug: 'updated-product'
			});
			expect(result).toEqual(updatedProduct);
		});

		it('should throw NotFoundException if product to update not found', async () => {
			const productId = 999;
			const productDto: Omit<ProductDto, 'slug'> = {
				name: 'Updated Product',
				description: 'Updated Description',
				price: 150,
				imagesUrl: ['updated-image.jpg'],
				categoryId: 1
			};

			mockProductRepository.findById.mockResolvedValue(null);

			await expect(service.update(productId, productDto)).rejects.toThrow(
				new NotFoundException(`Product with id ${productId} not found`)
			);
		});

		it('should throw NotFoundException if update operation fails', async () => {
			const productId = 1;
			const productDto: Omit<ProductDto, 'slug'> = {
				name: 'Updated Product',
				description: 'Updated Description',
				price: 150,
				imagesUrl: ['updated-image.jpg'],
				categoryId: 1
			};

			const existingProduct = { id: productId, name: 'Old Product', slug: 'old-product' };

			mockProductRepository.findById.mockResolvedValue(existingProduct);
			mockProductRepository.update.mockResolvedValue(null);

			await expect(service.update(productId, productDto)).rejects.toThrow(
				new NotFoundException(`Product with id ${productId} not found`)
			);
		});
	});

	describe('delete', () => {
		it('should delete a product', async () => {
			const productId = 1;
			const deletedProduct = { id: productId, name: 'Product 1' };

			mockProductRepository.delete.mockResolvedValue(deletedProduct);

			const result = await service.delete(productId);

			expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
			expect(result).toEqual(deletedProduct);
		});

		it('should throw NotFoundException if product to delete not found', async () => {
			const productId = 999;

			mockProductRepository.delete.mockResolvedValue(null);

			await expect(service.delete(productId)).rejects.toThrow(
				new NotFoundException(`Product with id ${productId} not found`)
			);
		});
	});
});
