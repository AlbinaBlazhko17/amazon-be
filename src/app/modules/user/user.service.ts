import { hash } from 'argon2';

import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';

import { UserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '@/common/pagination/interfaces/paginated-result.interface';
import { removePassword } from '@/utils/helpers/remove-password';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getMe(id: number): Promise<Partial<User> | null> {
		const user = await this.userRepository.findById(id, {
			password: false
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return removePassword(user);
	}

	async create(data: UserDto) {
		const { password, ...rest } = data;
		const hashedPassword = await hash(password);
		const userData = {
			...rest,
			password: hashedPassword
		};

		const user = await this.userRepository.create(userData);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async update(id: number, data: Partial<UserDto>): Promise<Partial<User>> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new Error(`User with ID ${id} not found`);
		}

		const updatedUser = await this.userRepository.update(id, data);

		return removePassword(updatedUser);
	}

	async delete(id: number): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new Error(`User with ID ${id} not found`);
		}

		return this.userRepository.delete(id);
	}

	async findById(id: number, select?: Prisma.UserSelect): Promise<Partial<User> | null> {
		const user = await this.userRepository.findById(id, select);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return removePassword(user);
	}

	async findAll(
		paginationQueryDto: PaginationQueryDto,
		params?: { select?: Prisma.UserSelect }
	): Promise<PaginatedResult<Partial<User>>> {
		return await this.userRepository.findAll(paginationQueryDto, {
			select: {
				...params?.select,
				password: false
			}
		});
	}

	async findByEmail(email: string): Promise<Partial<User> | null> {
		return await this.userRepository.findByEmail(email, {
			password: true
		});
	}
}
