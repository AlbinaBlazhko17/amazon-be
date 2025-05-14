import type { Request, Response } from 'express';

import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('sign-in')
	async sigIn(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, createdAt, updatedAt, ...user } = await this.authService.signIn(authDto);

		this.authService.removeRefreshTokenFromResponse(res);
		this.authService.addRefreshTokenToResponse(res, refreshToken);

		const responseData = {
			...user,
			createdAt,
			updatedAt
		};

		return responseData;
	}

	@HttpCode(200)
	@Post('sign-up')
	async signUp(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, createdAt, updatedAt, ...user } = await this.authService.signUp(authDto);

		this.authService.addRefreshTokenToResponse(res, refreshToken);

		return {
			...user,
			createdAt,
			updatedAt
		};
	}

	@Auth()
	@HttpCode(200)
	@Post('sign-out')
	signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.signOut(res, req.cookies[this.authService.REFRESH_TOKEN_NAME]);
	}

	@HttpCode(200)
	@Post('refresh-tokens')
	async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshTokenFromReq: string = req.cookies[this.authService.REFRESH_TOKEN_NAME];

		if (!refreshTokenFromReq) {
			this.authService.removeRefreshTokenFromResponse(res);

			return new UnauthorizedException('Refresh token not found');
		}

		const { refreshToken, ...response } = await this.authService.refreshTokens(refreshTokenFromReq);

		this.authService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}
}
