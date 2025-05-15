import * as argon2 from 'argon2';

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

jest.mock('argon2', () => ({
	hash: jest.fn().mockResolvedValue('hashed_password')
}));

describe('UsersService', () => {
	let service: UserService;

	const mockUserRepository = {
		create: jest.fn(),
		findById: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		findByIdWithFavorites: jest.fn(),
		findAll: jest.fn(),
		findByEmail: jest.fn()
	};

	const mockUser = {
		id: 1,
		email: 'test@example.com',
		password: 'hashed_password',
		name: 'Test User'
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserRepository,
					useValue: mockUserRepository
				}
			]
		}).compile();

		service = module.get<UserService>(UserService);

		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a user with hashed password', async () => {
			const userDto: UserDto = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
				avatarUrl: 'http://example.com/avatar.jpg',
				phoneNumber: '1234567890'
			};

			mockUserRepository.create.mockResolvedValue(mockUser);

			const result = await service.create(userDto);

			expect(argon2.hash).toHaveBeenCalledWith(userDto.password);
			expect(mockUserRepository.create).toHaveBeenCalledWith({
				email: userDto.email,
				password: 'hashed_password',
				name: userDto.name,
				avatarUrl: userDto.avatarUrl,
				phoneNumber: userDto.phoneNumber
			});
			expect(result).toEqual(mockUser);
		});

		it('should throw NotFoundException if user is not created', async () => {
			const userDto: UserDto = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
				avatarUrl: 'http://example.com/avatar.jpg',
				phoneNumber: '1234567890'
			};

			mockUserRepository.create.mockResolvedValue(null);

			await expect(service.create(userDto)).rejects.toThrow(NotFoundException);
		});
	});

	describe('update', () => {
		it('should update user data', async () => {
			const updateData = { name: 'Updated Name' };
			mockUserRepository.findById.mockResolvedValue(mockUser);
			mockUserRepository.update.mockResolvedValue({ ...mockUser, ...updateData });

			const result = await service.update(1, updateData);

			expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
			expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateData);
			expect(result).toEqual({
				id: mockUser.id,
				email: mockUser.email,
				...updateData
			});
		});

		it('should throw error if user not found', async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(service.update(999, { name: 'test' })).rejects.toThrow(
				'User with ID 999 not found'
			);
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			mockUserRepository.findById.mockResolvedValue(mockUser);
			mockUserRepository.delete.mockResolvedValue(mockUser);

			const result = await service.delete(1);

			expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
			expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
			expect(result).toEqual(mockUser);
		});

		it('should throw error if user not found', async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(service.delete(999)).rejects.toThrow('User with ID 999 not found');
		});
	});

	describe('findById', () => {
		it('should find user by id and remove password', async () => {
			mockUserRepository.findById.mockResolvedValue(mockUser);

			const result = await service.findById(1);

			expect(mockUserRepository.findById).toHaveBeenCalledWith(1, undefined);
			expect(result).toEqual(
				expect.objectContaining({
					id: mockUser.id,
					email: mockUser.email,
					name: mockUser.name
				})
			);
			expect(result).not.toHaveProperty('password');
		});

		it('should throw NotFoundException if user not found', async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(service.findById(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findByIdWithFavorites', () => {
		it('should find user with favorites', async () => {
			const userWithFavorites = {
				...mockUser,
				favorites: [{ id: 1, name: 'Favorite Item' }]
			};
			mockUserRepository.findByIdWithFavorites.mockResolvedValue(userWithFavorites);

			const result = await service.findByIdWithFavorites(1);

			expect(mockUserRepository.findByIdWithFavorites).toHaveBeenCalledWith(1);
			expect(result).toEqual(userWithFavorites);
		});

		it('should throw NotFoundException if user not found', async () => {
			mockUserRepository.findByIdWithFavorites.mockResolvedValue(null);

			await expect(service.findByIdWithFavorites(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findAll', () => {
		it('should return all users without passwords', async () => {
			const users = [mockUser, { ...mockUser, id: 2 }];
			mockUserRepository.findAll.mockResolvedValue(users);

			const result = await service.findAll();

			expect(mockUserRepository.findAll).toHaveBeenCalledWith({
				select: { password: false }
			});
			expect(result).toEqual(users);
		});

		it('should apply select params when provided', async () => {
			const selectParams = { name: true, email: true };
			mockUserRepository.findAll.mockResolvedValue([{ name: 'Test', email: 'test@example.com' }]);

			await service.findAll({ select: selectParams });

			expect(mockUserRepository.findAll).toHaveBeenCalledWith({
				select: { ...selectParams, password: false }
			});
		});
	});

	describe('findByEmail', () => {
		it('should find user by email with password', async () => {
			mockUserRepository.findByEmail.mockResolvedValue(mockUser);

			const result = await service.findByEmail('test@example.com');

			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com', {
				password: true
			});
			expect(result).toEqual(mockUser);
		});
	});
});
