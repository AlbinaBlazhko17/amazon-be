import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { ProductsSeeder } from './products.seeder';

@Module({
	providers: [PrismaService, ProductsSeeder],
	exports: [ProductsSeeder]
})
export class SeedersModule {}
