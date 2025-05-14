import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { CoreModule } from '@/core/core.module';

@Module({
	imports: [CoreModule, UsersModule, AuthModule],
	controllers: [],
	providers: []
})
export class AppModule {}
