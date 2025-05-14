import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { Review } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsSeeder {
	constructor(private prisma: PrismaService) {}

	async seed(): Promise<{ reviews: Review[] }> {
		console.log('🌱 Seeding reviews...');

		// Clear existing data (optional)
		// await this.prisma.$transaction([
		// 	this.prisma.product.deleteMany(),
		// 	this.prisma.category.deleteMany()
		// ]);

		const reviews = await this.createReviews();
		console.log(`✅ Created ${reviews.length} reviews`);

		return { reviews };
	}

	private async createReviews(): Promise<Review[]> {
		const users = await this.prisma.user.findMany();
		const userIds = users.map(user => user.id);
		const products = await this.prisma.product.findMany();
		const reviews = Array.from({ length: 100 }, () => ({
			productId: faker.helpers.arrayElement(products).id,
			rating: faker.number.int({ min: 1, max: 5 }),
			text: faker.lorem.sentence(10),
			userId:
				faker.number.int({ min: 0, max: userIds.length - 1 }) % userIds.length
					? userIds[faker.number.int({ min: 0, max: userIds.length - 1 }) % userIds.length]
					: null
		}));

		await this.prisma.review.createMany({
			data: reviews,
			skipDuplicates: true
		});

		return this.prisma.review.findMany({
			take: 100,
			orderBy: { createdAt: 'desc' }
		});
	}
}
