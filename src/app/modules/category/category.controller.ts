import { Request } from 'express';

import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Req
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';

import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async findAll() {
		return await this.categoryService.findAll();
	}

	@Get(':id')
	async findById(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const categoryId = Number(idFromParams);

		return await this.categoryService.findById(categoryId);
	}

	@Get('slug/:slug')
	async findBySlug(@Req() req: Request) {
		const slugFromParams = req.params.slug;

		if (!slugFromParams) {
			throw new BadRequestException('Invalid slug format');
		}

		return await this.categoryService.findBySlug(slugFromParams);
	}

	@Auth()
	@Post()
	async create(@Body() body: CategoryDto) {
		return await this.categoryService.create(body);
	}

	@Auth()
	@Patch(':id')
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
	async delete(@Req() req: Request) {
		const idFromParams = req.params.id;

		if (isNaN(Number(idFromParams))) {
			throw new BadRequestException('Invalid ID format');
		}

		const categoryId = Number(idFromParams);

		return await this.categoryService.delete(categoryId);
	}
}
