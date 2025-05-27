import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Query,
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

import { CurrentUser } from './decorators/user.decorator';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '@/common/pagination/interfaces/paginated-result.interface';

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
	async findAll(
		@Query() paginatedQuery: PaginationQueryDto
	): Promise<PaginatedResult<Partial<UserDto>>> {
		return this.userService.findAll(paginatedQuery);
	}

	@Auth()
	@Get('me')
	@Version('1.0')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Get current user' })
	@ApiResponse({ status: 200, description: 'Return current user' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async getMe(@CurrentUser('id') id: number) {
		return this.userService.getMe(id);
	}

	@Auth()
	@HttpCode(200)
	@Get(':userId')
	@Version('1.0')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 200, description: 'Return user by ID' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async findById(@Param('userId', ParseIntPipe) id: number) {
		return await this.userService.findById(id);
	}

	@Auth()
	@HttpCode(200)
	@Patch(':userId')
	@Version('1.0')
	@ApiOperation({ summary: 'Update user' })
	@ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
	@ApiBody({ type: UserDto, description: 'User data to update' })
	@ApiResponse({ status: 200, description: 'User updated successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	async update(@Param('userId', ParseIntPipe) id: number, @Body() userDto: Partial<UserDto>) {
		return await this.userService.update(id, userDto);
	}

	@Auth()
	@HttpCode(204)
	@Delete(':userId')
	@Version('1.0')
	@ApiOperation({ summary: 'Delete user' })
	@ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
	@ApiResponse({ status: 204, description: 'User deleted successfully' })
	@ApiResponse({ status: 400, description: 'Invalid ID format or User not found' })
	async delete(@Param('userId', ParseIntPipe) id: number) {
		await this.userService.delete(id);
	}
}
