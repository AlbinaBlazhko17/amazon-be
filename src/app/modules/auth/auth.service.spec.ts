import { Request, Response } from 'express';

import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user/user.service';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
	hash: jest.fn().mockResolvedValue('hashed_password')
}));

describe('AuthService', () => {
	let service: AuthService;
	let userService: UserService;
	let jwtService: JwtService;

	const mockUserService = {
		findByEmail: jest.fn(),
		findById: jest.fn(),
		create: jest.fn()
	};

	const mockJwtService = {
		sign: jest.fn(),
		verifyAsync: jest.fn()
	};

	const mockConfigService = {
		get: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UserService, useValue: mockUserService },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService }
			]
		}).compile();

		service = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
		jwtService = module.get<JwtService>(JwtService);

		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('signIn', () => {
		const mockAuthDto: AuthDto = { email: 'test@example.com', password: 'password123' };
		const mockUser = { id: 1, email: 'test@example.com' };
		const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
		const mockResponse = { clearCookie: jest.fn(), cookie: jest.fn() } as unknown as Response;

		it('should return user with tokens after successful sign in', async () => {
			jest.spyOn(service as any, 'validateUser').mockResolvedValue(mockUser);
			jest.spyOn(service, 'issueToken').mockReturnValue(mockTokens);

			const result = await service.signIn(mockResponse, mockAuthDto);

			expect(result).toEqual({ ...mockUser, ...mockTokens });
			expect(service['validateUser']).toHaveBeenCalledWith(mockAuthDto);
			expect(service.issueToken).toHaveBeenCalledWith(mockUser.id);
			expect(mockResponse.cookie).toHaveBeenCalled();
		});
	});

	describe('signUp', () => {
		const mockAuthDto: AuthDto = {
			email: 'test@example.com',
			password: 'password123',
			name: 'New User'
		};
		const mockUser = {
			id: 1,
			email: 'test@example.com',
			name: 'New User'
		};
		const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
		const mockResponse = { cookie: jest.fn() } as unknown as Response;

		it('should throw BadRequestException if user already exists', async () => {
			mockUserService.findByEmail.mockResolvedValue(mockUser);

			await expect(service.signUp(mockResponse, mockAuthDto)).rejects.toThrow(BadRequestException);
			expect(userService.findByEmail).toHaveBeenCalledWith(mockAuthDto.email);
		});

		it('should create and return user with tokens after successful sign up', async () => {
			mockUserService.findByEmail.mockResolvedValue(null);
			mockUserService.create.mockResolvedValue(mockUser);
			jest.spyOn(service, 'issueToken').mockReturnValue(mockTokens);

			const result = await service.signUp(mockResponse, mockAuthDto);

			expect(userService.findByEmail).toHaveBeenCalledWith(mockAuthDto.email);
			expect(userService.create).toHaveBeenCalledWith({
				...mockAuthDto,
				phoneNumber: null,
				avatarUrl: null
			});
			expect(service.issueToken).toHaveBeenCalledWith(mockUser.id);
			expect(mockResponse.cookie).toHaveBeenCalled();
			expect(result).toEqual({
				...mockUser,
				...mockTokens
			});
		});
	});

	describe('signOut', () => {
		const mockPayload = { id: 1 };
		const mockUser = { id: 1, email: 'test@example.com' };
		const mockRequest = {
			cookies: {}
		} as unknown as Request;
		const mockResponse = {
			clearCookie: jest.fn()
		} as unknown as Response;

		it('should throw UnauthorizedException if no refresh token provided', async () => {
			await expect(service.signOut(mockResponse, mockRequest)).rejects.toThrow(
				UnauthorizedException
			);
		});

		it('should throw UnauthorizedException if invalid refresh token provided', async () => {
			mockRequest.cookies = { refreshToken: 'invalid-token' };
			mockJwtService.verifyAsync.mockResolvedValue(null);

			await expect(service.signOut(mockResponse, mockRequest)).rejects.toThrow(
				UnauthorizedException
			);
			expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid-token');
		});

		it('should throw NotFoundException if user not found', async () => {
			mockRequest.cookies = { refreshToken: 'valid-token' };
			mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
			mockUserService.findById.mockResolvedValue(null);

			await expect(service.signOut(mockResponse, mockRequest)).rejects.toThrow(NotFoundException);
			expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
			expect(userService.findById).toHaveBeenCalledWith(mockPayload.id);
		});

		it('should clear cookie and return success message', async () => {
			mockRequest.cookies = { refreshToken: 'valid-token' };
			mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
			mockUserService.findById.mockResolvedValue(mockUser);

			const result = await service.signOut(mockResponse, mockRequest);

			expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
			expect(userService.findById).toHaveBeenCalledWith(mockPayload.id);
			expect(mockResponse.clearCookie).toHaveBeenCalled();
			expect(result).toEqual({ message: 'Logout successful' });
		});

		describe('refreshTokens', () => {
			const mockRequest = {
				cookies: {
					refreshToken: 'refreshToken'
				}
			} as unknown as Request;
			const mockPayload = { id: 1 };
			const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
			const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
			const mockResponse = { cookie: jest.fn() } as unknown as Response;

			it('should throw UnauthorizedException if invalid refresh token', async () => {
				mockJwtService.verifyAsync.mockRejectedValue(new UnauthorizedException('Invalid token'));

				await expect(service.refreshTokens(mockRequest, mockResponse)).rejects.toThrow(
					UnauthorizedException
				);
				expect(jwtService.verifyAsync).toHaveBeenCalledWith('refreshToken');
			});

			it('should throw NotFoundException if user not found', async () => {
				mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
				mockUserService.findById.mockResolvedValue(null);

				await expect(service.refreshTokens(mockRequest, mockResponse)).rejects.toThrow(
					NotFoundException
				);
				expect(jwtService.verifyAsync).toHaveBeenCalledWith('refreshToken');
				expect(userService.findById).toHaveBeenCalledWith(mockPayload.id);
			});

			it('should issue new tokens and return user with tokens', async () => {
				mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
				mockUserService.findById.mockResolvedValue(mockUser);
				jest.spyOn(service, 'issueToken').mockReturnValue(mockTokens);

				const result = await service.refreshTokens(mockRequest, mockResponse);

				expect(jwtService.verifyAsync).toHaveBeenCalledWith('refreshToken');
				expect(userService.findById).toHaveBeenCalledWith(mockPayload.id);
				expect(service.issueToken).toHaveBeenCalledWith(Number(mockUser.id));
				expect(mockResponse.cookie).toHaveBeenCalled();
				expect(result).toEqual({
					...mockUser,
					password: undefined,
					...mockTokens
				});
			});
		});
	});
});
