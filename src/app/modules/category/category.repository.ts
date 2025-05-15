import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { CategoryDto } from './category.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CategoryRepository {
	private readonly categorySelectFields: Prisma.CategorySelect = {
		id: true,
		name: true,
		createdAt: true,
		updatedAt: true
	};

	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return await this.prisma.category.findMany();
	}

	async findById(id: number) {
		return await this.prisma.category.findUnique({
			where: { id },
			select: {
				...this.categorySelectFields
			}
		});
	}

	async findBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: { slug },
			select: {
				...this.categorySelectFields
			}
		});
	}

	async create(data: Prisma.CategoryCreateInput) {
		return await this.prisma.category.create({
			data,
			select: {
				...this.categorySelectFields
			}
		});
	}

	async update(id: number, data: CategoryDto) {
		return await this.prisma.category.update({
			where: { id },
			data,
			select: {
				...this.categorySelectFields
			}
		});
	}

	async delete(id: number) {
		return await this.prisma.category.delete({
			where: { id },
			select: {
				...this.categorySelectFields
			}
		});
	}
}
