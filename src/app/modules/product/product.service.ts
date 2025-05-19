import { Injectable } from '@nestjs/common';

import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	async findById(id: number) {
		return await this.productRepository.findById(id);
	}
}
