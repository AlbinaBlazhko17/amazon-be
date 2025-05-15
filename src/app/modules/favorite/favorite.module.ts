import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

import { FavoritesController } from './favorite.controller';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';

@Module({
	imports: [UserModule],
	controllers: [FavoritesController],
	providers: [FavoriteService, FavoriteRepository, UserService]
})
export class FavoriteModule {}
