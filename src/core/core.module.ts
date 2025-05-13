import { Global, type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';

import { AppExceptionsFilter } from './filters/app-exceptions.filter';
import { LoggerService } from './logger/logger.service';
import appConfig from '@/config/app.config';
import { PrismaModule } from '@/prisma/prisma.module';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig]
		}),
		PrismaModule
	],
	providers: [
		{
			provide: APP_FILTER,
			useFactory: (httpAdapterHost: HttpAdapterHost, logger: LoggerService) => {
				return new AppExceptionsFilter(httpAdapterHost, logger);
			},
			inject: [HttpAdapterHost, LoggerService]
		},
		LoggerService
	],
	exports: [LoggerService]
})
export class CoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerService).forRoutes();
	}
}
