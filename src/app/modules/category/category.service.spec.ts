import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryDto } from './category.dto';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
	let service: CategoryService;
	let repository: CategoryRepository;

	const mockCategoryRepository = {
		findAll: jest.fn(),
		findById: jest.fn(),
		findBySlug: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	const categoryDto: CategoryDto = {
		name: 'Test Category'
	};

	const categoryEntity = {
		id: 1,
		name: 'Test Category',
		slug: 'test-category',
		createdAt: new Date(),
		updatedAt: new Date()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoryService,
				{
					provide: CategoryRepository,
					useValue: mockCategoryRepository
				}
			]
		}).compile();

		service = module.get<CategoryService>(CategoryService);
		repository = module.get<CategoryRepository>(CategoryRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of categories', async () => {
			mockCategoryRepository.findAll.mockResolvedValue([categoryEntity]);
			const result = await service.findAll();
			expect(result).toEqual([categoryEntity]);
			expect(repository.findAll).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		it('should return a category by id', async () => {
			mockCategoryRepository.findById.mockResolvedValue(categoryEntity);
			const result = await service.findById(1);
			expect(result).toEqual(categoryEntity);
			expect(repository.findById).toHaveBeenCalledWith(1);
		});

		it('should throw NotFoundException if category not found', async () => {
			mockCategoryRepository.findById.mockResolvedValue(null);
			await expect(service.findById(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findBySlug', () => {
		it('should return a category by slug', async () => {
			mockCategoryRepository.findBySlug.mockResolvedValue(categoryEntity);
			const result = await service.findBySlug('test-category');
			expect(result).toEqual(categoryEntity);
			expect(repository.findBySlug).toHaveBeenCalledWith('test-category');
		});

		it('should throw NotFoundException if category not found by slug', async () => {
			mockCategoryRepository.findBySlug.mockResolvedValue(null);
			await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should create a category', async () => {
			mockCategoryRepository.create.mockResolvedValue(categoryEntity);
			const result = await service.create(categoryDto);
			expect(result).toEqual(categoryEntity);
			expect(repository.create).toHaveBeenCalledWith({
				...categoryDto,
				slug: 'test-category'
			});
		});
	});

	describe('update', () => {
		it('should update a category', async () => {
			mockCategoryRepository.findById.mockResolvedValue(categoryEntity);
			mockCategoryRepository.update.mockResolvedValue({
				...categoryEntity,
				name: 'Updated Category',
				slug: 'updated-category'
			});

			const updatedDto = { name: 'Updated Category' };
			const result = await service.update(1, updatedDto);

			expect(result).toEqual({
				...categoryEntity,
				name: 'Updated Category',
				slug: 'updated-category'
			});
			expect(repository.update).toHaveBeenCalledWith(1, {
				...updatedDto,
				slug: 'updated-category'
			});
		});

		it('should throw NotFoundException if category to update not found', async () => {
			mockCategoryRepository.findById.mockResolvedValue(null);
			await expect(service.update(999, categoryDto)).rejects.toThrow(NotFoundException);
		});
	});

	describe('delete', () => {
		it('should delete a category', async () => {
			mockCategoryRepository.findById.mockResolvedValue(categoryEntity);
			mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

			await service.delete(1);

			expect(repository.delete).toHaveBeenCalledWith(1);
		});

		it('should throw NotFoundException if category to delete not found', async () => {
			mockCategoryRepository.findById.mockResolvedValue(null);
			await expect(service.delete(999)).rejects.toThrow(NotFoundException);
		});
	});
});
