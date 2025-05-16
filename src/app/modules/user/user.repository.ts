import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';

import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '@/common/pagination/interfaces/paginated-result.interface';
import { PaginationService } from '@/common/pagination/pagination.service';
import { PrismaService } from '@/prisma/prisma.service';

export interface IUserRepository {
	findById(id: number, select?: Prisma.UserSelect): Promise<Partial<User> | null>;
	findAll(params?: { select?: Prisma.UserSelect }): Promise<Partial<User>[]>;
	create(data: Prisma.UserCreateInput): Promise<User>;
	update(id: number, data: Prisma.UserUpdateInput): Promise<User>;
	delete(id: number): Promise<User>;
}

@Injectable()
export class UserRepository {
	private readonly userSelectFields: Prisma.UserSelect = {
		id: true,
		name: true,
		email: true,
		password: true,
		avatarUrl: true,
		phoneNumber: true,
		createdAt: true,
		updatedAt: true
	};

	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService
	) {}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({ data });
	}

	async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data
		});
	}

	async delete(id: number): Promise<User> {
		return this.prisma.user.delete({
			where: { id }
		});
	}

	async findAll(
		paginationQueryDto: PaginationQueryDto,
		params?: { select?: Prisma.UserSelect }
	): Promise<PaginatedResult<User>> {
		const { select = {} } = params || {};

		return this.pagination.paginate(
			this.prisma.user,
			paginationQueryDto,
			{},
			{ createdAt: 'desc' },
			{},
			{ ...this.userSelectFields, ...select, password: false }
		);
	}

	async findById(id: number, select?: Prisma.UserSelect): Promise<Partial<User> | null> {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				...this.userSelectFields,
				...select
			}
		});
	}

	async findByEmail(email: string, select?: Prisma.UserSelect): Promise<Partial<User> | null> {
		return this.prisma.user.findUnique({
			where: { email },
			select: {
				...this.userSelectFields,
				...select
			}
		});
	}
}
