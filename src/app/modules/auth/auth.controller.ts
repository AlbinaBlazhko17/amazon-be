import type { Request, Response } from 'express';

import { Body, Controller, HttpCode, Post, Req, Res, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Sign in with credentials' })
	@ApiBody({ type: AuthDto })
	@ApiResponse({ status: 200, description: 'User successfully signed in' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@HttpCode(200)
	@Post('sign-in')
	@Version('1.0')
	async signIn(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.signIn(res, authDto);
	}

	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({ type: AuthDto })
	@ApiResponse({ status: 200, description: 'User successfully registered' })
	@ApiResponse({ status: 400, description: 'Invalid data or user already exists' })
	@HttpCode(200)
	@Post('sign-up')
	@Version('1.0')
	async signUp(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.signUp(res, authDto);
	}

	@ApiOperation({ summary: 'Sign out the current user' })
	@ApiResponse({ status: 200, description: 'User successfully signed out' })
	@ApiResponse({ status: 401, description: 'User not authenticated' })
	@ApiBearerAuth('JWT-auth')
	@Auth()
	@HttpCode(200)
	@Post('sign-out')
	@Version('1.0')
	signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.signOut(res, req);
	}

	@ApiOperation({ summary: 'Refresh authentication tokens' })
	@ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
	@ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
	@HttpCode(200)
	@Post('refresh-tokens')
	@Version('1.0')
	async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return await this.authService.refreshTokens(req, res);
	}
}
