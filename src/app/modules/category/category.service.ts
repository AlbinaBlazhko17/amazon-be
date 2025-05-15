import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryDto } from './category.dto';
import { CategoryRepository } from './category.repository';
import { slugify } from '@/utils/helpers/slugify';

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async findAll() {
		return await this.categoryRepository.findAll();
	}

	async findById(id: number) {
		const category = await this.categoryRepository.findById(id);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return category;
	}

	async findBySlug(slug: string) {
		const category = await this.categoryRepository.findBySlug(slug);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return category;
	}

	async create(data: CategoryDto) {
		const dataWithSlug = {
			...data,
			slug: slugify(data.name)
		};

		return await this.categoryRepository.create(dataWithSlug);
	}

	async update(id: number, data: CategoryDto) {
		const dataWithSlug = {
			...data,
			slug: slugify(data.name)
		};

		const existingCategory = await this.categoryRepository.findById(id);

		if (!existingCategory) {
			throw new NotFoundException('Category not found');
		}

		return await this.categoryRepository.update(id, dataWithSlug);
	}

	async delete(id: number) {
		const existingCategory = await this.categoryRepository.findById(id);

		if (!existingCategory) {
			throw new NotFoundException('Category not found');
		}

		return await this.categoryRepository.delete(id);
	}
}
