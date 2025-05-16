import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
	@ApiProperty({
		description: 'Number of records to skip',
		default: 0,
		required: false
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	skip?: number = 0;

	@ApiProperty({
		description: 'Number of records to take',
		default: 10,
		required: false
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	take?: number = 10;
}
