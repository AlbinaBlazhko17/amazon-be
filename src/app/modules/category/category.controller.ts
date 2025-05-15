import { Request } from 'express';

import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
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

import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

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
	async findById(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const categoryId = Number(idFromParams);

		return await this.categoryService.findById(categoryId);
	}

	@Get('slug/:slug')
	@Version('1.0')
	@ApiOperation({ summary: 'Get category by slug' })
	@ApiParam({ name: 'slug', description: 'Category slug', example: 'electronics' })
	@ApiResponse({ status: 200, description: 'Return a category by slug' })
	@ApiResponse({ status: 400, description: 'Invalid slug format' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async findBySlug(@Req() req: Request) {
		const slugFromParams = req.params.slug;

		if (!slugFromParams) {
			throw new BadRequestException('Invalid slug format');
		}

		return await this.categoryService.findBySlug(slugFromParams);
	}

	@Auth()
	@Post()
	@Version('1.0')
	@ApiBearerAuth()
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
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update category' })
	@ApiParam({ name: 'id', description: 'Category ID', example: '1' })
	@ApiBody({ type: CategoryDto })
	@ApiResponse({ status: 200, description: 'Category successfully updated' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async update(@Req() req: Request, @Body() body: CategoryDto) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const categoryId = Number(idFromParams);

		return await this.categoryService.update(categoryId, body);
	}

	@Auth()
	@Delete(':id')
	@Version('1.0')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete category' })
	@ApiParam({ name: 'id', description: 'Category ID', example: '1' })
	@ApiResponse({ status: 200, description: 'Category successfully deleted' })
	@ApiResponse({ status: 400, description: 'Invalid ID format' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async delete(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const categoryId = Number(idFromParams);

		return await this.categoryService.delete(categoryId);
	}
}
