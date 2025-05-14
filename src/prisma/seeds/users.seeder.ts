import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersSeeder {
	constructor(private prisma: PrismaService) {}

	async seed(): Promise<{ users: User[] }> {
		console.log('🌱 Seeding users...');

		// Clear existing data (optional)
		// await this.prisma.$transaction([
		// 	this.prisma.product.deleteMany(),
		// 	this.prisma.category.deleteMany()
		// ]);

		const users = await this.createUsers();
		console.log(`✅ Created ${users.length} users`);

		return { users };
	}

	private async createUsers(): Promise<User[]> {
		const users = Array.from({ length: 100 }, () => ({
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.fullName(),
			avatarUrl: faker.image.avatar()
		}));

		await this.prisma.user.createMany({
			data: users,
			skipDuplicates: true
		});

		return this.prisma.user.findMany({
			take: 100,
			orderBy: { createdAt: 'desc' }
		});
	}
}
