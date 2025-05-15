import { Test, TestingModule } from '@nestjs/testing';

import { FavoritesController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

describe('FavoritesController', () => {
	let controller: FavoritesController;
	let favoritesService: FavoriteService;

	const mockFavoritesService = {
		getFavorites: jest.fn(),
		addToFavorites: jest.fn(),
		removeFromFavorites: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FavoritesController],
			providers: [
				{
					provide: FavoriteService,
					useValue: mockFavoritesService
				}
			]
		}).compile();

		controller = module.get<FavoritesController>(FavoritesController);
		favoritesService = module.get<FavoriteService>(FavoriteService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findFavorites', () => {
		it('should return user favorites', async () => {
			const userId = 1;
			const expectedResult = [
				{ id: 1, name: 'Product 1' },
				{ id: 2, name: 'Product 2' }
			];

			mockFavoritesService.getFavorites.mockResolvedValue(expectedResult);

			const result = await controller.findFavorites(userId);

			expect(favoritesService.getFavorites).toHaveBeenCalledWith(userId);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('addToFavorites', () => {
		it('should add product to favorites', async () => {
			const userId = 1;
			const productId = 2;
			const expectedResult = { success: true, message: 'Product added to favorites' };

			mockFavoritesService.addToFavorites.mockResolvedValue(expectedResult);

			const result = await controller.addToFavorites(userId, productId);

			expect(favoritesService.addToFavorites).toHaveBeenCalledWith(userId, productId);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('removeFromFavorites', () => {
		it('should remove product from favorites', async () => {
			const userId = 1;
			const productId = 2;
			const expectedResult = { success: true, message: 'Product removed from favorites' };

			mockFavoritesService.removeFromFavorites.mockResolvedValue(expectedResult);

			const result = await controller.removeFromFavorites(userId, productId);

			expect(favoritesService.removeFromFavorites).toHaveBeenCalledWith(userId, productId);
			expect(result).toEqual(expectedResult);
		});
	});
});
