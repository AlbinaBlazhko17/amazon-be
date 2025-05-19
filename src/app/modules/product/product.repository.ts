import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginationService } from '@/common/pagination/pagination.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService
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
			include: {
				category: true
			}
		});
	}

	async findAllPaginated(paginationQueryDto: PaginationQueryDto) {
		return this.pagination.paginate(
			this.prisma.product,
			paginationQueryDto,
			{
				where: {},
				include: {
					category: true
				}
			},
			{
				orderBy: {
					id: 'asc'
				}
			},
			{},
			{}
		);
	}

	async findByCategoryId(categoryId: number, paginationQueryDto: PaginationQueryDto) {
		return this.pagination.paginate(
			this.prisma.product,
			paginationQueryDto,
			{
				where: {
					categoryId
				}
			},
			{
				orderBy: {
					id: 'asc'
				}
			},
			{
				include: {
					category: true
				}
			},
			{}
		);
	}

	async findById(id: number) {
		return this.prisma.product.findUnique({
			where: { id },
			include: {
				category: true
			}
		});
	}

	async create(data: Prisma.ProductCreateInput) {
		return this.prisma.product.create({
			data,
			include: {
				category: true
			}
		});
	}

	async update(id: number, data: Prisma.ProductUpdateInput) {
		return this.prisma.product.update({
			where: { id },
			data,
			include: {
				category: true
			}
		});
	}

	async delete(id: number) {
		return this.prisma.product.delete({
			where: { id }
		});
	}

	async findByName(name: string) {
		return this.prisma.product.findFirst({
			where: { name }
		});
	}
}
