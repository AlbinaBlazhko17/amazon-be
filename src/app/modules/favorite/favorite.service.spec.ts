import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user/user.service';

import { FavoriteRepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
	let favoriteService: FavoriteService;
	let favoriteRepository: FavoriteRepository;
	let userService: UserService;

	const mockUser = { id: 1, email: 'test@example.com' };
	const mockFavorite = {
		product: {
			id: 1,
			name: 'Awesome Marble Car',
			price: 129.09,
			description: 'Professional-grade Shirt perfect for fine training and recreational use',
			imagesUrl: [
				'https://loremflickr.com/640/480?lock=717475699248950',
				'https://loremflickr.com/640/480?lock=4509574556443987',
				'https://loremflickr.com/640/480?lock=3724763436008435',
				'https://loremflickr.com/640/480?lock=96401227122066'
			],
			category: {
				id: 6,
				name: 'Electronics'
			}
		}
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FavoriteService,
				{
					provide: FavoriteRepository,
					useValue: {
						getUserFavorites: jest.fn(),
						addToFavorites: jest.fn(),
						removeFromFavorites: jest.fn()
					}
				},
				{
					provide: UserService,
					useValue: {
						findById: jest.fn()
					}
				}
			]
		}).compile();

		favoriteService = module.get<FavoriteService>(FavoriteService);
		favoriteRepository = module.get<FavoriteRepository>(FavoriteRepository);
		userService = module.get<UserService>(UserService);
	});

	describe('addToFavorites', () => {
		it('should add product to favorites successfully', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
			jest.spyOn(favoriteRepository, 'getUserFavorites').mockResolvedValue([]);
			jest.spyOn(favoriteRepository, 'addToFavorites').mockResolvedValue(mockFavorite);

			const result = await favoriteService.addToFavorites(1, 1);

			expect(userService.findById).toHaveBeenCalledWith(1);
			expect(favoriteRepository.getUserFavorites).toHaveBeenCalledWith(1);
			expect(favoriteRepository.addToFavorites).toHaveBeenCalledWith(1, 1);
			expect(result).toEqual(mockFavorite.product);
		});

		it('should throw NotFoundException if user is not found', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(null);

			await expect(favoriteService.addToFavorites(1, 1)).rejects.toThrow(
				new NotFoundException('User not found')
			);
		});

		it('should throw NotFoundException if product is already in favorites', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
			jest.spyOn(favoriteRepository, 'getUserFavorites').mockResolvedValue([mockFavorite]);

			await expect(favoriteService.addToFavorites(1, 1)).rejects.toThrow(
				new NotFoundException('Product is already in favorites')
			);
		});
	});

	describe('removeFromFavorites', () => {
		it('should remove product from favorites successfully', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
			jest.spyOn(favoriteRepository, 'removeFromFavorites').mockResolvedValue(undefined);

			await favoriteService.removeFromFavorites(1, 1);

			expect(userService.findById).toHaveBeenCalledWith(1);
			expect(favoriteRepository.removeFromFavorites).toHaveBeenCalledWith(1, 1);
		});

		it('should throw NotFoundException if user is not found', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(null);

			await expect(favoriteService.removeFromFavorites(1, 1)).rejects.toThrow(
				new NotFoundException('User not found')
			);
		});
	});

	describe('getFavorites', () => {
		it('should return user favorites successfully', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
			jest.spyOn(favoriteRepository, 'getUserFavorites').mockResolvedValue([mockFavorite]);

			const result = await favoriteService.getFavorites(1);

			expect(userService.findById).toHaveBeenCalledWith(1);
			expect(favoriteRepository.getUserFavorites).toHaveBeenCalledWith(1);
			expect(result).toEqual([mockFavorite.product]);
		});

		it('should throw NotFoundException if user is not found', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(null);

			await expect(favoriteService.getFavorites(1)).rejects.toThrow(
				new NotFoundException('User not found')
			);
		});

		it('should return empty array if user has no favorites', async () => {
			jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
			jest.spyOn(favoriteRepository, 'getUserFavorites').mockResolvedValue([]);

			const result = await favoriteService.getFavorites(1);

			expect(result).toEqual([]);
		});
	});
});
