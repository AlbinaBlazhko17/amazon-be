import { Request } from 'express';

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './user.controller';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

describe('UsersController', () => {
	let controller: UsersController;
	let userService: UserService;

	const mockUserService = {
		findAll: jest.fn(),
		findById: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	};

	const mockRequest = {
		params: {}
	} as unknown as Request;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UserService,
					useValue: mockUserService
				}
			]
		}).compile();

		controller = module.get<UsersController>(UsersController);
		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const users = [{ id: 1, name: 'Test User', email: 'test@test.com' }];
			mockUserService.findAll.mockResolvedValue(users);

			expect(await controller.findAll()).toBe(users);
			expect(userService.findAll).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		it('should return a user by id', async () => {
			const user = { id: 1, name: 'Test User', email: 'test@test.com' };
			mockUserService.findById.mockResolvedValue(user);
			mockRequest.params.id = '1';

			expect(await controller.findById(mockRequest)).toBe(user);
			expect(userService.findById).toHaveBeenCalledWith(1);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			mockRequest.params.id = 'abc';

			await expect(controller.findById(mockRequest)).rejects.toThrow(BadRequestException);
		});
	});

	describe('update', () => {
		it('should update a user', async () => {
			const userDto: Partial<UserDto> = { name: 'Updated Name' };
			const updatedUser = { id: 1, name: 'Updated Name', email: 'test@test.com', password: 'hash' };
			const expectedResult = { id: 1, name: 'Updated Name', email: 'test@test.com' };

			mockUserService.update.mockResolvedValue(updatedUser);
			mockRequest.params.id = '1';

			expect(await controller.update(mockRequest, userDto)).toEqual(expectedResult);
			expect(userService.update).toHaveBeenCalledWith(1, userDto);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			const userDto: Partial<UserDto> = { name: 'Updated Name' };
			mockRequest.params.id = 'abc';

			await expect(controller.update(mockRequest, userDto)).rejects.toThrow(BadRequestException);
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			const user = { id: 1, name: 'Test User', email: 'test@test.com' };
			mockUserService.findById.mockResolvedValue(user);
			mockUserService.delete.mockResolvedValue(undefined);
			mockRequest.params.id = '1';

			expect(await controller.delete(mockRequest)).toEqual({
				message: 'User deleted successfully'
			});
			expect(userService.findById).toHaveBeenCalledWith(1);
			expect(userService.delete).toHaveBeenCalledWith(1);
		});

		it('should throw BadRequestException if id is not a number', async () => {
			mockRequest.params.id = 'abc';

			await expect(controller.delete(mockRequest)).rejects.toThrow(BadRequestException);
		});

		it('should throw BadRequestException if user not found', async () => {
			mockUserService.findById.mockResolvedValue(null);
			mockRequest.params.id = '1';

			await expect(controller.delete(mockRequest)).rejects.toThrow(BadRequestException);
			expect(userService.findById).toHaveBeenCalledWith(1);
		});
	});
});
