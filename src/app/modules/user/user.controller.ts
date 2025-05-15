import { Request } from 'express';

import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Patch,
	Req,
	Version
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';

import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { removePassword } from '@/utils/helpers/remove-password';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@HttpCode(200)
	@Get()
	@Version('1.0')
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'Return all users' })
	async findAll() {
		return this.userService.findAll();
	}

	@Auth()
	@HttpCode(200)
	@Get('/favorites/:id')
	@Version('1.0')
	@ApiOperation({ summary: 'Get user favorites by ID' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'Return user favorites' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async findFavorites(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const userId = Number(idFromParams);

		return await this.userService.findByIdWithFavorites(userId);
	}

	@Auth()
	@HttpCode(200)
	@Get(':id')
	@Version('1.0')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'Return user by ID' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
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
	@Version('1.0')
	@ApiOperation({ summary: 'Update user' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiBody({ type: UserDto, description: 'User data to update' })
	@ApiResponse({ status: 200, description: 'User updated successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
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
	@Version('1.0')
	@ApiOperation({ summary: 'Delete user' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'User deleted successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format or User not found' })
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
