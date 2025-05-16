import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

import { FavoritesController } from './favorite.controller';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';
import { PaginationModule } from '@/common/pagination/pagination.module';
import { PaginationService } from '@/common/pagination/pagination.service';

@Module({
	imports: [UserModule, PaginationModule],
	controllers: [FavoritesController],
	providers: [FavoriteService, FavoriteRepository, UserService, PaginationService]
})
export class FavoriteModule {}
