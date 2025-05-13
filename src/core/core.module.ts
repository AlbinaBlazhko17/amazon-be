import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ExceptionsModule } from './exceptions/exceptions.module';
import { LoggingModule } from './logging/logging.module';
import { PrismaModule } from './prisma/prisma.module';
import appConfig from '@/config/app.config';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig]
		}),

		PrismaModule,
		LoggingModule,
		ExceptionsModule
	],
	exports: [PrismaModule, LoggingModule, ExceptionsModule]
})
export class CoreModule {}
