import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { Category, Product } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsSeeder {
	constructor(private prisma: PrismaService) {}

	async seed(count = 50): Promise<{ categories: Category[]; products: Product[] }> {
		console.log('🌱 Seeding products...');

		// Clear existing data (optional)
		// await this.prisma.$transaction([
		// 	this.prisma.product.deleteMany(),
		// 	this.prisma.category.deleteMany()
		// ]);

		const categories = await this.createCategories();
		console.log(`✅ Created ${categories.length} categories`);

		const products = await this.createProducts(count, categories);
		console.log(`✅ Created ${products.length} products`);

		return { categories, products };
	}

	private async createCategories(): Promise<Category[]> {
		await this.prisma.category.createMany({
			data: Array.from({ length: 10 }, () => {
				const name = faker.commerce.department();
				return {
					name,
					slug: faker.helpers.slugify(name).toLocaleLowerCase()
				};
			}),
			skipDuplicates: true
		});

		return this.prisma.category.findMany();
	}

	private async createProducts(count: number, categories: Category[]): Promise<Product[]> {
		const productData = Array.from({ length: count }, () => {
			const name = faker.commerce.productName();
			const slug = faker.helpers.slugify(name).toLocaleLowerCase();
			const imageCount = faker.number.int({ min: 1, max: 5 });
			const imagesUrl = Array.from({ length: imageCount }, () =>
				faker.image.urlLoremFlickr({ width: 640, height: 480 })
			);
			const category = faker.helpers.arrayElement(categories);

			return {
				name,
				slug,
				description: faker.commerce.productDescription(),
				price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
				imagesUrl,
				categoryId: category.id
			};
		});

		await this.prisma.product.createMany({
			data: productData,
			skipDuplicates: true
		});

		return this.prisma.product.findMany({
			take: count,
			orderBy: { createdAt: 'desc' }
		});
	}
}
