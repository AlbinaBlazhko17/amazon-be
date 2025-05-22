import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CategoryService } from '../category/category.service';

import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductRepository } from './product.repository';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { slugify } from '@/utils/helpers/slugify';

@Injectable()
export class ProductService {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly categoryService: CategoryService
	) {}

	async findAll(filterDto: ProductFilterDto) {
		return await this.productRepository.findAllPaginated(filterDto);
	}

	async findById(id: number) {
		const product = await this.productRepository.findById(id);

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		return product;
	}

	async findBySlug(slug: string) {
		const product = await this.productRepository.findBySlug(slug);

		if (!product) {
			throw new NotFoundException(`Product with slug ${slug} not found`);
		}

		return product;
	}

	async findByCategoryId(categoryId: number, paginationQueryDto: PaginationQueryDto) {
		const product = await this.productRepository.findByCategoryId(categoryId, paginationQueryDto);

		if (!product) {
			throw new NotFoundException(`Product with category id ${categoryId} not found`);
		}

		return product;
	}

	async create(productDto: Required<ProductDto>) {
		const slug = slugify(productDto.name);

		const category = await this.categoryService.findById(productDto.categoryId);

		if (!category) {
			throw new NotFoundException(`Category with id ${productDto.categoryId} not found`);
		}

		const existingProduct = await this.productRepository.findBySlug(slug);

		if (existingProduct) {
			throw new BadRequestException(`Product with name ${productDto.name} already exists`);
		}

		const data = {
			...productDto,
			slug
		};

		return await this.productRepository.create(data);
	}

	async update(id: number, productDto: Omit<ProductDto, 'slug'>) {
		const existingProduct = await this.productRepository.findById(id);

		if (!existingProduct) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}
		const slug = slugify(productDto.name);

		const data = {
			...productDto,
			slug
		};

		const product = await this.productRepository.update(id, data);

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		return product;
	}

	async delete(id: number) {
		const product = await this.productRepository.delete(id);

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}
		return product;
	}
}
