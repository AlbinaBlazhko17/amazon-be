import { PrismaService } from './prisma.service';
import { ProductsSeeder } from './seeds/products.seeder';
import { ReviewsSeeder } from './seeds/reviews.seeder';
import { UsersSeeder } from './seeds/users.seeder';

const prisma = new PrismaService();

async function main() {
	try {
		const usersSeeder = new UsersSeeder(prisma);
		await usersSeeder.seed();
		const productsSeeder = new ProductsSeeder(prisma);
		await productsSeeder.seed(50);
		const reviewsSeeder = new ReviewsSeeder(prisma);
		await reviewsSeeder.seed();

		console.log('Seeding completed successfully!');
	} catch (error) {
		console.error('Error during seeding:', error);
		throw error;
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
