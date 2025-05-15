import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
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
	async findFavorites(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.findByIdWithFavorites(id);
	}

	@Auth()
	@HttpCode(200)
	@Get(':id')
	@Version('1.0')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'Return user by ID' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async findById(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.findById(id);
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
	async update(@Param('id', ParseIntPipe) id: number, @Body() userDto: Partial<UserDto>) {
		return await this.userService.update(id, userDto);
	}

	@Auth()
	@HttpCode(204)
	@Delete(':id')
	@Version('1.0')
	@ApiOperation({ summary: 'Delete user' })
	@ApiParam({ name: 'id', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 204, description: 'User deleted successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format or User not found' })
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.userService.delete(id);
	}
}
