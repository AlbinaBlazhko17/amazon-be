import { Request } from 'express';

import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Patch,
	Req
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';

import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { removePassword } from '@/utils/helpers/remove-password';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@Auth()
	@HttpCode(200)
	@Get(':id')
	async findById(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const userId = Number(idFromParams);

		return await this.userService.findById(userId);
	}

	@Auth()
	@HttpCode(200)
	@Patch(':id')
	async update(
		@Req()
		req: Request,
		@Body() userDto: Partial<UserDto>
	) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const userId = Number(idFromParams);

		const updatedUser = await this.userService.update(userId, userDto);

		return removePassword(updatedUser);
	}

	@Auth()
	@HttpCode(200)
	@Delete(':id')
	async delete(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}
		const userId = Number(idFromParams);

		const user = await this.userService.findById(userId);
		if (!user) {
			throw new BadRequestException('User not found');
		}

		await this.userService.delete(userId);
		return {
			message: 'User deleted successfully'
		};
	}
}
