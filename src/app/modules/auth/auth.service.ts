import { verify } from 'argon2';
import { Response } from 'express';

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

	async signIn(authDto: AuthDto) {
		const user = await this.validateUser(authDto);

		const tokens = this.issueToken(user.id);
		return {
			...user,
			...tokens
		};
	}

	async signUp(authDto: AuthDto) {
		const oldUser = await this.userService.findByEmail(authDto.email);

		if (oldUser) throw new BadRequestException('User already exists');

		const newUser = {
			...authDto,
			name: authDto.name || '',
			phoneNumber: null,
			avatarUrl: null
		};

		const user = await this.userService.create(newUser);

		const tokens = this.issueToken(user.id);

		return {
			...removePassword(user),
			...tokens
		};
	}

	async signOut(res: Response, refreshToken: string | undefined) {
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

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: expiresIn
		});
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME, {
			domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		});
	}

	async refreshTokens(refreshToken: string) {
		const payload = await this.jwtService.verifyAsync(refreshToken);

		if (!payload) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.userService.findById(payload.id);

		if (!user) throw new NotFoundException('User not found');

		const tokens = this.issueToken(Number(user.id));

		return {
			...removePassword(user),
			...tokens
		};
	}

	private issueToken(userId: number) {
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
}
