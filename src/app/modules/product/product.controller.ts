import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	ParseIntPipe,
	Patch,
	Post,
	Query
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductDto } from './product.dto';
import { ProductService } from './product.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@ApiOperation({ summary: 'Get all products' })
	@ApiResponse({ status: 200, description: 'Return all products with pagination' })
	async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
		return this.productService.findAll(paginationQueryDto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get product by id' })
	@ApiResponse({ status: 200, description: 'Return product by id' })
	async findById(@Query('id', ParseIntPipe) id: number) {
		return this.productService.findById(id);
	}

	@Get('slugs/:slug')
	@ApiOperation({ summary: 'Get product by slug' })
	@ApiResponse({ status: 200, description: 'Return product by slug' })
	async findBySlug(@Query('slug') slug: string) {
		return this.productService.findBySlug(slug);
	}

	@Get('categories/:categoryId')
	@ApiOperation({ summary: 'Get products by category id' })
	@ApiResponse({ status: 200, description: 'Return products by category id' })
	async findByCategoryId(
		@Query('categoryId', ParseIntPipe) categoryId: number,
		@Query() paginationQueryDto: PaginationQueryDto
	) {
		return this.productService.findByCategoryId(categoryId, paginationQueryDto);
	}

	@Post()
	@ApiOperation({ summary: 'Create product' })
	@ApiResponse({ status: 201, description: 'Product created successfully' })
	async create(@Body() productDto: Required<ProductDto>) {
		return this.productService.create(productDto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update product' })
	@ApiResponse({ status: 200, description: 'Product updated successfully' })
	async update(@Query('id', ParseIntPipe) id: number, @Body() productDto: ProductDto) {
		return this.productService.update(id, productDto);
	}

	@Delete(':id')
	@HttpCode(204)
	@ApiOperation({ summary: 'Delete product' })
	@ApiResponse({ status: 200, description: 'Product deleted successfully' })
	async delete(@Query('id', ParseIntPipe) id: number) {
		return this.productService.delete(id);
	}
}
