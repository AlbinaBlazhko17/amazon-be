import helmet from 'helmet';
import { Server } from 'http';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@app/app.module';

import { CacheService } from '@/core/cache/cache.service';
import { PrismaService } from '@/prisma/prisma.service';

let app: INestApplication;
let httpServer: Server;
let moduleFixture: TestingModule;
let cache: CacheService;
let database: PrismaService;

beforeAll(async () => {
	moduleFixture = await Test.createTestingModule({
		imports: [AppModule]
	}).compile();

	app = moduleFixture.createNestApplication();
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	cache = moduleFixture.get<CacheService>(CacheService);
	database = moduleFixture.get<PrismaService>(PrismaService);

	await app.init();
	httpServer = app.getHttpServer();
});

afterEach(async () => {
	await database.resetDb();
	await cache.reset();
});

afterAll(async () => {
	await app.close();
});

export { httpServer, app };
