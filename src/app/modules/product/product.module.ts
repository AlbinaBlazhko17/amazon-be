import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';

import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { PaginationModule } from '@/common/pagination/pagination.module';
import { PaginationService } from '@/common/pagination/pagination.service';

@Module({
	controllers: [ProductController, PaginationModule, CategoryModule],
	providers: [ProductService, ProductRepository, PaginationService, CategoryService],
	exports: [ProductService]
})
export class ProductModule {}
