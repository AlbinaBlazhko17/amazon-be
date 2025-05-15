import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryController } from './category.controller';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
	let controller: CategoryController;
	let categoryService: CategoryService;

	const mockCategoryService = {
		findAll: jest.fn(),
		findById: jest.fn(),
		findBySlug: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	const mockCategory = {
		id: 1,
		name: 'Electronics',
		slug: 'electronics'
	};

	const mockCategoryDto: CategoryDto = {
		name: 'Electronics'
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoryController],
			providers: [
				{
					provide: CategoryService,
					useValue: mockCategoryService
				}
			]
		}).compile();

		controller = module.get<CategoryController>(CategoryController);
		categoryService = module.get<CategoryService>(CategoryService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of categories', async () => {
			const categories = [mockCategory];
			mockCategoryService.findAll.mockResolvedValue(categories);

			expect(await controller.findAll()).toBe(categories);
			expect(categoryService.findAll).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		it('should return a category by id', async () => {
			mockCategoryService.findById.mockResolvedValue(mockCategory);

			const req = { params: { id: '1' } } as any;
			expect(await controller.findById(req)).toBe(mockCategory);
			expect(categoryService.findById).toHaveBeenCalledWith(1);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			const req = { params: { id: 'abc' } } as any;

			await expect(controller.findById(req)).rejects.toThrow(BadRequestException);
		});
	});

	describe('findBySlug', () => {
		it('should return a category by slug', async () => {
			mockCategoryService.findBySlug.mockResolvedValue(mockCategory);

			const req = { params: { slug: 'electronics' } } as any;
			expect(await controller.findBySlug(req)).toBe(mockCategory);
			expect(categoryService.findBySlug).toHaveBeenCalledWith('electronics');
		});

		it('should throw BadRequestException if slug is not provided', async () => {
			const req = { params: { slug: '' } } as any;

			await expect(controller.findBySlug(req)).rejects.toThrow(BadRequestException);
		});
	});

	describe('create', () => {
		it('should create a new category', async () => {
			mockCategoryService.create.mockResolvedValue(mockCategory);

			expect(await controller.create(mockCategoryDto)).toBe(mockCategory);
			expect(categoryService.create).toHaveBeenCalledWith(mockCategoryDto);
		});
	});

	describe('update', () => {
		it('should update a category', async () => {
			mockCategoryService.update.mockResolvedValue(mockCategory);

			const req = { params: { id: '1' } } as any;
			expect(await controller.update(req, mockCategoryDto)).toBe(mockCategory);
			expect(categoryService.update).toHaveBeenCalledWith(1, mockCategoryDto);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			const req = { params: { id: 'abc' } } as any;

			await expect(controller.update(req, mockCategoryDto)).rejects.toThrow(BadRequestException);
		});
	});

	describe('delete', () => {
		it('should delete a category', async () => {
			mockCategoryService.delete.mockResolvedValue({ message: 'Success' });

			const req = { params: { id: '1' } } as any;
			expect(await controller.delete(req)).toEqual({ message: 'Success' });
			expect(categoryService.delete).toHaveBeenCalledWith(1);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			const req = { params: { id: 'abc' } } as any;

			await expect(controller.delete(req)).rejects.toThrow(BadRequestException);
		});
	});
});
