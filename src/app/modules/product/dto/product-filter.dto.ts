import { IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

export class ProductFilterDto extends PaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Search by name'
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({
		description: 'Search by description'
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: 'General search across multiple fields' })
	@IsOptional()
	@IsString()
	search?: string;
}
