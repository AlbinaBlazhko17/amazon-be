import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
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

import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { SlugValidationPipe } from '@/core/pipes/slug-validation.pipe';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	@Version('1.0')
	@ApiOperation({ summary: 'Get all categories' })
	@ApiResponse({ status: 200, description: 'Return all categories' })
	async findAll() {
		return await this.categoryService.findAll();
	}

	@Get(':id')
	@Version('1.0')
	@ApiOperation({ summary: 'Get category by ID' })
	@ApiParam({ name: 'id', description: 'Category ID', example: '1' })
	@ApiResponse({ status: 200, description: 'Return a category by ID' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async findById(@Param('id', ParseIntPipe) id: number) {
		return await this.categoryService.findById(id);
	}

	@Get('slug/:slug')
	@Version('1.0')
	@ApiOperation({ summary: 'Get category by slug' })
	@ApiParam({ name: 'slug', description: 'Category slug', example: 'electronics' })
	@ApiResponse({ status: 200, description: 'Return a category by slug' })
	@ApiResponse({ status: 400, description: 'Invalid slug format' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async findBySlug(@Param('slug', SlugValidationPipe) slug: string) {
		return await this.categoryService.findBySlug(slug);
	}

	@Auth()
	@Post()
	@Version('1.0')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Create new category' })
	@ApiBody({ type: CategoryDto })
	@ApiResponse({ status: 201, description: 'Category successfully created' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async create(@Body() body: CategoryDto) {
		return await this.categoryService.create(body);
	}

	@Auth()
	@Patch(':id')
	@Version('1.0')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Update category' })
	@ApiParam({ name: 'id', description: 'Category ID', example: '1' })
	@ApiBody({ type: CategoryDto })
	@ApiResponse({ status: 200, description: 'Category successfully updated' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: CategoryDto) {
		return await this.categoryService.update(id, body);
	}

	@Auth()
	@Delete(':id')
	@Version('1.0')
	@HttpCode(204)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Delete category' })
	@ApiParam({ name: 'id', description: 'Category ID', example: '1' })
	@ApiResponse({ status: 204, description: 'Category successfully deleted' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.categoryService.delete(id);
	}
}
