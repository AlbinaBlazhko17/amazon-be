import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProductFilterDto } from './dto/product-filter.dto';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginationService } from '@/common/pagination/pagination.service';
import { CacheService } from '@/core/cache/cache.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductRepository {
	private readonly productSelect: Prisma.ProductSelect = {
		id: true,
		name: true,
		description: true,
		imagesUrl: true,
		price: true,
		slug: true,
		averageRating: true,
		reviewsCount: true,
		isFeatured: true,
		createdAt: true,
		updatedAt: true,
		category: {
			select: {
				id: true,
				name: true,
				slug: true
			}
		}
	};

	private readonly CACHE_KEYS = {
		FEATURED_PRODUCTS: 'products:featured',
		FEATURED_PRODUCTS_COUNT: 'products:featured:count'
	};

	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService,
		private readonly cache: CacheService
	) {}

	async findAll() {
		return this.prisma.product.findMany({
			include: {
				category: true
			}
		});
	}

	async findBySlug(slug: string) {
		return this.prisma.product.findUnique({
			where: { slug },
			select: {
				...this.productSelect
			}
		});
	}

	async findAllPaginated(filterDto: ProductFilterDto) {
		const where = this.buildWhereClause(filterDto);

		return this.pagination.paginate(
			this.prisma.product,
			filterDto,
			where,
			{
				id: 'asc'
			},
			{},
			{
				...this.productSelect
			}
		);
	}

	async findByCategoryId(categoryId: number, paginationQueryDto: PaginationQueryDto) {
		return this.pagination.paginate(
			this.prisma.product,
			paginationQueryDto,
			{
				categoryId
			},
			{
				id: 'asc'
			},
			{},
			{
				...this.productSelect
			}
		);
	}

	async findById(id: number) {
		return this.prisma.product.findUnique({
			where: { id },
			select: {
				...this.productSelect
			}
		});
	}

	async create(data: Prisma.ProductCreateInput) {
		const countOfFeatured = await this.countFeatured();

		if (data.isFeatured) {
			if (countOfFeatured >= 5) {
				throw new Error('Cannot have more than 5 featured products');
			}
			await this.invalidateFeaturedCache();
		}

		return this.prisma.product.create({
			data,
			select: {
				...this.productSelect
			}
		});
	}

	async update(id: number, data: Prisma.ProductUpdateInput) {
		if (data.isFeatured) {
			const countOfFeatured = await this.countFeatured();
			if (countOfFeatured >= 5) {
				throw new Error('Cannot have more than 5 featured products');
			}
			await this.invalidateFeaturedCache();
		}

		return this.prisma.product.update({
			where: { id },
			data,
			select: {
				...this.productSelect
			}
		});
	}

	async delete(id: number) {
		const deletedProduct = await this.prisma.product.delete({
			where: { id }
		});

		if (deletedProduct.isFeatured) {
			await this.invalidateFeaturedCache();
		}

		return deletedProduct;
	}

	async findByName(name: string) {
		return this.prisma.product.findFirst({
			where: { name }
		});
	}

	async findFeatured() {
		const cacheKey = this.CACHE_KEYS.FEATURED_PRODUCTS;

		const cachedFeatured = await this.cache.get(cacheKey);

		if (cachedFeatured) {
			return cachedFeatured;
		}

		const products = await this.prisma.product.findMany({
			where: {
				isFeatured: true
			},
			select: {
				...this.productSelect
			},
			orderBy: {
				updatedAt: 'desc'
			}
		});

		await this.cache.set(cacheKey, products, 120);

		return products;
	}

	async countFeatured() {
		const cacheKey = this.CACHE_KEYS.FEATURED_PRODUCTS_COUNT;
		const cachedCount = await this.cache.get(cacheKey);
		if (cachedCount) {
			return cachedCount as number;
		}
		const count = await this.prisma.product.count({
			where: {
				isFeatured: true
			}
		});

		await this.cache.set(cacheKey, count, 120);

		return count;
	}

	private async invalidateFeaturedCache() {
		await this.cache.del(this.CACHE_KEYS.FEATURED_PRODUCTS);
		await this.cache.del(this.CACHE_KEYS.FEATURED_PRODUCTS_COUNT);
	}

	private buildWhereClause(filterDto: ProductFilterDto) {
		const { name, description, search } = filterDto;
		const where: Prisma.ProductWhereInput = {};

		if (name) {
			where.name = {
				contains: name,
				mode: 'insensitive'
			};
		}

		if (description) {
			where.description = {
				contains: description,
				mode: 'insensitive'
			};
		}

		if (search) {
			where.OR = [
				{
					name: {
						contains: search,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: search,
						mode: 'insensitive'
					}
				}
			];
		}

		return where;
	}
}
