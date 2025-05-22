import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator';

import { Prisma } from '@prisma/client';

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string;

	@IsNumber()
	price?: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@ArrayMinSize(1)
	imagesUrl?: string[];

	@IsNumber()
	categoryId: number;
}
