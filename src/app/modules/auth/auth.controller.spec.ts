import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
	let controller: AuthController;
	let authService: AuthService;

	const mockAuthService = {
		signIn: jest.fn(),
		signUp: jest.fn(),
		signOut: jest.fn(),
		refreshTokens: jest.fn()
	};

	const mockResponse = {
		cookie: jest.fn().mockReturnThis(),
		clearCookie: jest.fn().mockReturnThis()
	} as unknown as Response;

	const mockRequest = {
		user: { id: 'user-id' },
		cookies: { refreshToken: 'refresh-token' }
	} as unknown as Request;

	const authDto: AuthDto = {
		email: 'test@example.com',
		password: 'password123'
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService
				}
			]
		}).compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('signIn', () => {
		it('should call authService.signIn with correct parameters', async () => {
			const authResponse = { accessToken: 'access-token' };
			mockAuthService.signIn.mockResolvedValue(authResponse);

			const result = await controller.signIn(authDto, mockResponse);

			expect(authService.signIn).toHaveBeenCalledWith(mockResponse, authDto);
			expect(result).toEqual(authResponse);
		});
	});

	describe('signUp', () => {
		it('should call authService.signUp with correct parameters', async () => {
			const authResponse = { accessToken: 'access-token' };
			mockAuthService.signUp.mockResolvedValue(authResponse);

			const result = await controller.signUp(authDto, mockResponse);

			expect(authService.signUp).toHaveBeenCalledWith(mockResponse, authDto);
			expect(result).toEqual(authResponse);
		});
	});

	describe('signOut', () => {
		it('should call authService.signOut with correct parameters', () => {
			const signOutResponse = { success: true };
			mockAuthService.signOut.mockReturnValue(signOutResponse);

			const result = controller.signOut(mockRequest, mockResponse);

			expect(authService.signOut).toHaveBeenCalledWith(mockResponse, mockRequest);
			expect(result).toEqual(signOutResponse);
		});
	});

	describe('refreshTokens', () => {
		it('should call authService.refreshTokens with correct parameters', async () => {
			const refreshResponse = { accessToken: 'new-access-token' };
			mockAuthService.refreshTokens.mockResolvedValue(refreshResponse);

			const result = await controller.refreshTokens(mockRequest, mockResponse);

			expect(authService.refreshTokens).toHaveBeenCalledWith(mockRequest, mockResponse);
			expect(result).toEqual(refreshResponse);
		});
	});
});
