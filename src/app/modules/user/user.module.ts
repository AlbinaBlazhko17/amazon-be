import { Module } from '@nestjs/common';

import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { PaginationModule } from '@/common/pagination/pagination.module';
import { PaginationService } from '@/common/pagination/pagination.service';

@Module({
	imports: [PaginationModule],
	controllers: [UsersController],
	providers: [UserService, UserRepository, PaginationService],
	exports: [UserService, UserRepository]
})
export class UserModule {}
