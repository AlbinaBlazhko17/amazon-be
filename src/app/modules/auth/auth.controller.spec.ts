import { Response } from 'express';

import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
	let controller: AuthController;

	const mockAuthService = {
		signIn: jest.fn(),
		signUp: jest.fn(),
		signOut: jest.fn(),
		refreshTokens: jest.fn(),
		addRefreshTokenToResponse: jest.fn(),
		removeRefreshTokenFromResponse: jest.fn(),
		REFRESH_TOKEN_NAME: 'refreshToken'
	};

	const mockResponse = {
		cookie: jest.fn(),
		clearCookie: jest.fn()
	} as unknown as Response;

	const mockRequest = {
		cookies: {}
	};

	const mockAuthDto: AuthDto = {
		email: 'test@example.com',
		password: 'password123'
	};

	const mockUser = {
		id: 1,
		email: 'test@example.com',
		refreshToken: 'refresh-token',
		createdAt: new Date(),
		updatedAt: new Date()
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
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('signIn', () => {
		it('should call authService.signIn with authDto', async () => {
			mockAuthService.signIn.mockResolvedValue(mockUser);

			await controller.sigIn(mockAuthDto, mockResponse);

			expect(mockAuthService.signIn).toHaveBeenCalledWith(mockAuthDto);
		});

		it('should add refresh token to response', async () => {
			mockAuthService.signIn.mockResolvedValue(mockUser);

			await controller.sigIn(mockAuthDto, mockResponse);

			expect(mockAuthService.removeRefreshTokenFromResponse).toHaveBeenCalledWith(mockResponse);
			expect(mockAuthService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				mockUser.refreshToken
			);
		});

		it('should return user without refreshToken', async () => {
			mockAuthService.signIn.mockResolvedValue(mockUser);

			const result = await controller.sigIn(mockAuthDto, mockResponse);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { refreshToken, ...expectedUser } = mockUser;
			expect(result).toEqual(expectedUser);
		});
	});

	describe('signUp', () => {
		it('should call authService.signUp with authDto', async () => {
			mockAuthService.signUp.mockResolvedValue(mockUser);

			await controller.signUp(mockAuthDto, mockResponse);

			expect(mockAuthService.signUp).toHaveBeenCalledWith(mockAuthDto);
		});

		it('should add refresh token to response', async () => {
			mockAuthService.signUp.mockResolvedValue(mockUser);

			await controller.signUp(mockAuthDto, mockResponse);

			expect(mockAuthService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				mockUser.refreshToken
			);
		});

		it('should return user without refreshToken', async () => {
			mockAuthService.signUp.mockResolvedValue(mockUser);

			const result = await controller.signUp(mockAuthDto, mockResponse);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { refreshToken, ...expectedUser } = mockUser;
			expect(result).toEqual(expectedUser);
		});
	});

	describe('signOut', () => {
		it('should call authService.signOut with response and refreshToken', () => {
			mockRequest.cookies = { [mockAuthService.REFRESH_TOKEN_NAME]: 'test-refresh-token' };

			controller.signOut(mockRequest as any, mockResponse);

			expect(mockAuthService.signOut).toHaveBeenCalledWith(mockResponse, 'test-refresh-token');
		});
	});

	describe('refreshTokens', () => {
		it('should throw UnauthorizedException if refresh token not found', async () => {
			mockRequest.cookies = {};

			const result = await controller.refreshTokens(mockRequest as any, mockResponse);

			expect(mockAuthService.removeRefreshTokenFromResponse).toHaveBeenCalledWith(mockResponse);
			expect(result).toBeInstanceOf(UnauthorizedException);
		});

		it('should call authService.refreshTokens with token from cookies', async () => {
			mockRequest.cookies = { [mockAuthService.REFRESH_TOKEN_NAME]: 'test-refresh-token' };
			const mockRefreshResponse = { user: { id: 1 }, refreshToken: 'new-refresh-token' };
			mockAuthService.refreshTokens.mockResolvedValue(mockRefreshResponse);

			await controller.refreshTokens(mockRequest as any, mockResponse);

			expect(mockAuthService.refreshTokens).toHaveBeenCalledWith('test-refresh-token');
		});

		it('should add new refresh token to response', async () => {
			mockRequest.cookies = { [mockAuthService.REFRESH_TOKEN_NAME]: 'test-refresh-token' };
			const mockRefreshResponse = { user: { id: 1 }, refreshToken: 'new-refresh-token' };
			mockAuthService.refreshTokens.mockResolvedValue(mockRefreshResponse);

			await controller.refreshTokens(mockRequest as any, mockResponse);

			expect(mockAuthService.addRefreshTokenToResponse).toHaveBeenCalledWith(
				mockResponse,
				'new-refresh-token'
			);
		});

		it('should return response without refreshToken', async () => {
			mockRequest.cookies = { [mockAuthService.REFRESH_TOKEN_NAME]: 'test-refresh-token' };
			const mockRefreshResponse = { user: { id: 1 }, refreshToken: 'new-refresh-token' };
			mockAuthService.refreshTokens.mockResolvedValue(mockRefreshResponse);

			const result = await controller.refreshTokens(mockRequest as any, mockResponse);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { refreshToken, ...expectedResponse } = mockRefreshResponse;
			expect(result).toEqual(expectedResponse);
		});
	});
});
