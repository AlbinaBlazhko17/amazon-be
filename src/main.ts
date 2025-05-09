import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';

import { EmojiLogger } from './core/logging/logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true
	});

	const logger = app.get(EmojiLogger);

	app.useLogger(logger);

	app.enableCors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	app.setGlobalPrefix('/api');

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
