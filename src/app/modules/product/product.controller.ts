import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Version
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@Version('1.0')
	@ApiOperation({ summary: 'Get all products' })
	@ApiResponse({ status: 200, description: 'Return all products with pagination' })
	async findAll(@Query() filterDto: ProductFilterDto) {
		return this.productService.findAll(filterDto);
	}

	@Get('featured')
	@Version('1.0')
	@ApiOperation({ summary: 'Get featured products' })
	@ApiResponse({ status: 200, description: 'Return featured products' })
	async findFeatured() {
		return this.productService.findFeatured();
	}

	@Get(':productId')
	@Version('1.0')
	@ApiOperation({ summary: 'Get product by id' })
	@ApiResponse({ status: 200, description: 'Return product by id' })
	async findById(@Query('productId', ParseIntPipe) id: number) {
		return this.productService.findById(id);
	}

	@Get('slugs/:slug')
	@Version('1.0')
	@ApiOperation({ summary: 'Get product by slug' })
	@ApiResponse({ status: 200, description: 'Return product by slug' })
	async findBySlug(@Query('slug') slug: string) {
		return this.productService.findBySlug(slug);
	}

	@Get('categories/:categoryId')
	@Version('1.0')
	@ApiOperation({ summary: 'Get products by category id' })
	@ApiResponse({ status: 200, description: 'Return products by category id' })
	async findByCategoryId(
		@Query('categoryId', ParseIntPipe) categoryId: number,
		@Query() paginationQueryDto: PaginationQueryDto
	) {
		return this.productService.findByCategoryId(categoryId, paginationQueryDto);
	}

	@Post()
	@Version('1.0')
	@ApiOperation({ summary: 'Create product' })
	@ApiResponse({ status: 201, description: 'Product created successfully' })
	async create(@Body() productDto: Required<ProductDto>) {
		return this.productService.create(productDto);
	}

	@Patch(':productId')
	@Version('1.0')
	@ApiOperation({ summary: 'Update product' })
	@ApiResponse({ status: 200, description: 'Product updated successfully' })
	async update(@Query('productId', ParseIntPipe) id: number, @Body() productDto: ProductDto) {
		return this.productService.update(id, productDto);
	}

	@Delete(':productId')
	@Version('1.0')
	@HttpCode(204)
	@ApiOperation({ summary: 'Delete product' })
	@ApiResponse({ status: 204, description: 'Product deleted successfully' })
	async delete(@Query('productId', ParseIntPipe) id: number) {
		await this.productService.delete(id);
	}
}
