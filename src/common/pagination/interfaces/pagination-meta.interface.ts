export interface PaginationMeta {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}
