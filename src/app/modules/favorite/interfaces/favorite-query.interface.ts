export interface IFavoriteQuery {
	product: {
		id: number;
		name: string;
		price: number;
		description: string;
		imagesUrl: string[];
		category: ICategory | null;
	};
}

export interface ICategory {
	id: number;
	name: string;
}
