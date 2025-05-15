import { verify } from 'argon2';
import { Request, Response } from 'express';

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

import { AuthDto } from './auth.dto';
import { removePassword } from '@/utils/helpers/remove-password';

@Injectable()
export class AuthService {
	readonly configService: ConfigService = new ConfigService();
	readonly REFRESH_TOKEN_NAME =
		this.configService.get<string>('refreshTokenSecret') || 'refreshToken';

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async signIn(res: Response, authDto: AuthDto) {
		const { createdAt, updatedAt, ...user } = await this.validateUser(authDto);

		const tokens = this.issueToken(user.id);

		this.removeRefreshTokenFromResponse(res);
		this.addRefreshTokenToResponse(res, tokens.refreshToken);

		return {
			...user,
			...tokens,
			createdAt,
			updatedAt
		};
	}

	async signUp(res: Response, authDto: AuthDto) {
		const oldUser = await this.userService.findByEmail(authDto.email);

		if (oldUser) throw new BadRequestException('User already exists');

		const newUser = {
			...authDto,
			name: authDto.name || '',
			phoneNumber: null,
			avatarUrl: null
		};

		const { createdAt, updatedAt, ...user } = await this.userService.create(newUser);

		const tokens = this.issueToken(user.id);

		this.addRefreshTokenToResponse(res, tokens.refreshToken);

		return {
			...removePassword(user),
			...tokens,
			createdAt,
			updatedAt
		};
	}

	async signOut(res: Response, req: Request) {
		const refreshToken = req.cookies[this.REFRESH_TOKEN_NAME];

		if (!refreshToken) throw new UnauthorizedException('No refresh token found');

		const payload = await this.jwtService.verifyAsync(refreshToken);

		if (!payload) throw new UnauthorizedException('Invalid refresh token');
		const user = await this.userService.findById(payload.id);

		if (!user) throw new NotFoundException('User not found');

		this.removeRefreshTokenFromResponse(res);

		return {
			message: 'Logout successful'
		};
	}

	async refreshTokens(req: Request, res: Response) {
		const refreshTokenFromReq: string = req.cookies[this.REFRESH_TOKEN_NAME];

		if (!refreshTokenFromReq) {
			this.removeRefreshTokenFromResponse(res);

			return new UnauthorizedException('Refresh token not found');
		}

		const payload = await this.jwtService.verifyAsync(refreshTokenFromReq);

		if (!payload) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.userService.findById(payload.id);

		if (!user) throw new NotFoundException('User not found');

		const tokens = this.issueToken(Number(user.id));

		this.addRefreshTokenToResponse(res, tokens.refreshToken);

		return {
			...removePassword(user),
			...tokens
		};
	}

	issueToken(userId: number) {
		const payload = { id: userId };

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.configService.get<string>('jwtExpiration') || '1h'
		});

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.configService.get<string>('jwtRefreshExpiration') || '7d'
		});

		return { accessToken, refreshToken };
	}

	private async validateUser(authDto: AuthDto) {
		const user = await this.userService.findByEmail(authDto.email);

		if (!user) throw new NotFoundException('User not found');

		if (!user.password) throw new UnauthorizedException('Password not set');

		const isPasswordValid = await verify(user.password, authDto.password);

		if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

		return removePassword(user);
	}

	private addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: expiresIn
		});
	}

	private removeRefreshTokenFromResponse(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME, {
			domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		});
	}
}
