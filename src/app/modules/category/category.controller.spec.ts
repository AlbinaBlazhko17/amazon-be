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

	describe('getAll', () => {
		it('should return an array of categories', async () => {
			const categories = [mockCategory];
			mockCategoryService.findAll.mockResolvedValue(categories);

			expect(await controller.findAll()).toBe(categories);
			expect(categoryService.findAll).toHaveBeenCalled();
		});
	});

	describe('byId', () => {
		it('should return a category by id', async () => {
			mockCategoryService.findById.mockResolvedValue(mockCategory);

			expect(await controller.findById(1)).toBe(mockCategory);
			expect(categoryService.findById).toHaveBeenCalledWith(1);
		});
	});

	describe('bySlug', () => {
		it('should return a category by slug', async () => {
			mockCategoryService.findBySlug.mockResolvedValue(mockCategory);

			expect(await controller.findBySlug('electronics')).toBe(mockCategory);
			expect(categoryService.findBySlug).toHaveBeenCalledWith('electronics');
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

			expect(await controller.update(1, mockCategoryDto)).toBe(mockCategory);
			expect(categoryService.update).toHaveBeenCalledWith(1, mockCategoryDto);
		});
	});

	describe('delete', () => {
		it('should delete a category', async () => {
			mockCategoryService.delete.mockResolvedValue(undefined);

			expect(await controller.delete(1)).toEqual(undefined);
			expect(categoryService.delete).toHaveBeenCalledWith(1);
		});
	});
});
