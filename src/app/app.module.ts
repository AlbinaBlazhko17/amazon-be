import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '@/config/app.config';
import { CoreModule } from '@/core/core.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [appConfig]
		}),
		CoreModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
