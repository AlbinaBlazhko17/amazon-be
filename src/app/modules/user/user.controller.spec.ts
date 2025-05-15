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

		jest.clearAllMocks();
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

			expect(await controller.findById(1)).toBe(user);
			expect(userService.findById).toHaveBeenCalledWith(1);
		});
	});

	describe('update', () => {
		it('should update a user', async () => {
			const userDto: Partial<UserDto> = { name: 'Updated Name' };
			const updatedUser = { id: 1, name: 'Updated Name', email: 'test@test.com', password: 'hash' };
			const expectedResult = {
				id: 1,
				name: 'Updated Name',
				email: 'test@test.com',
				password: 'hash'
			};

			mockUserService.update.mockResolvedValue(updatedUser);

			expect(await controller.update(1, userDto)).toEqual(expectedResult);
			expect(userService.update).toHaveBeenCalledWith(1, userDto);
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			const user = { id: 1, name: 'Test User', email: 'test@test.com' };
			mockUserService.findById.mockResolvedValue(user);
			mockUserService.delete.mockResolvedValue(undefined);

			expect(await controller.delete(1)).toEqual(undefined);
		});
	});
});
