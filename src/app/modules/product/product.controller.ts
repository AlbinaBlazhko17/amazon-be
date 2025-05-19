import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';

@ApiTags('order')
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get product by id' })
	@ApiResponse({ status: 200, description: 'Return product by id' })
	async findAll(@Query('id', ParseIntPipe) id: number) {
		return this.productService.findById(id);
	}
}
