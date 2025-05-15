import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ReviewModule } from './modules/review/review.module';
import { UsersModule } from './modules/user/user.module';
import { CoreModule } from '@/core/core.module';

@Module({
	imports: [CoreModule, UsersModule, AuthModule, CategoryModule, ReviewModule],
	controllers: [],
	providers: []
})
export class AppModule {}
