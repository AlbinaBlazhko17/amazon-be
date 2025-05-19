import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';
import { CoreModule } from '@/core/core.module';

@Module({
	imports: [
		CoreModule,
		UserModule,
		AuthModule,
		CategoryModule,
		ReviewModule,
		FavoriteModule,
		OrderItemModule,
		OrderModule,
		ProductModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
