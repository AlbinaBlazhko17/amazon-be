import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';
import { PaginationMeta } from './interfaces/pagination-meta.interface';

@Injectable()
export class PaginationService {
	async paginate<T>(
		model: any,
		paginationQueryDto: PaginationQueryDto,
		where = {},
		orderBy = {},
		include = {},
		select = {}
	): Promise<PaginatedResult<T>> {
		const { skip = 0, take = 10 } = paginationQueryDto;
		const page = Math.floor(skip / take) + 1;

		const totalItems = await model.count({ where });

		const totalPages = Math.ceil(totalItems / take);

		const queryOptions: any = {
			where,
			skip,
			take
		};

		if (Object.keys(orderBy).length > 0) {
			queryOptions.orderBy = orderBy;
		}

		if (Object.keys(include).length > 0) {
			queryOptions.include = include;
		}

		if (Object.keys(select).length > 0) {
			queryOptions.select = select;
		}

		const data = await model.findMany(queryOptions);

		const meta: PaginationMeta = {
			page,
			limit: take,
			totalItems,
			totalPages,
			hasPreviousPage: page > 1,
			hasNextPage: page < totalPages
		};

		return {
			data,
			meta
		};
	}

	async paginateRaw<T>(
		prismaClient: PrismaClient,
		modelName: string,
		paginationQueryDto: PaginationQueryDto,
		queryOptions: any = {}
	): Promise<PaginatedResult<T>> {
		const { skip = 0, take = 10 } = paginationQueryDto;
		const page = Math.floor(skip / take) + 1;

		const countOptions = { ...queryOptions };
		if (countOptions.select) delete countOptions.select;
		if (countOptions.include) delete countOptions.include;
		if (countOptions.orderBy) delete countOptions.orderBy;

		const totalItems = await prismaClient[modelName].count({
			where: countOptions.where || {}
		});

		const finalQueryOptions = {
			...queryOptions,
			skip,
			take
		};

		const data = await prismaClient[modelName].findMany(finalQueryOptions);

		const totalPages = Math.ceil(totalItems / take);

		const meta: PaginationMeta = {
			page,
			limit: take,
			totalItems,
			totalPages,
			hasPreviousPage: page > 1,
			hasNextPage: page < totalPages
		};

		return {
			data,
			meta
		};
	}
}
