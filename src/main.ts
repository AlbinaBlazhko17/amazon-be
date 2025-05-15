import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@app/app.module';

import { config } from './config/swagger.config';
import { LoggerService } from '@/core/logger/logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true
	});

	const logger = app.get(LoggerService);

	app.useLogger(logger);

	app.use(helmet());
	app.use(cookieParser());
	app.enableVersioning({
		type: VersioningType.URI
	});

	app.enableCors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	app.setGlobalPrefix('/api');
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
