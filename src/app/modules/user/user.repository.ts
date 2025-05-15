import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';

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

	constructor(private readonly prisma: PrismaService) {}

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

	async findAll(params?: { select?: Prisma.UserSelect }): Promise<Partial<User>[]> {
		const { select = {} } = params || {};

		return this.prisma.user.findMany({
			select: {
				...this.userSelectFields,
				...select
			}
		});
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

	async findByIdWithFavorites(
		id: number,
		select?: Prisma.UserSelect
	): Promise<Partial<User> | null> {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				...this.userSelectFields,
				favorites: {
					select: {
						id: true,
						product: {
							select: {
								id: true,
								name: true,
								description: true,
								price: true,
								imagesUrl: true,
								categoryId: true,
								category: {
									select: {
										id: true,
										name: true,
										slug: true
									}
								}
							}
						}
					}
				},
				...select
			}
		});
	}
}
