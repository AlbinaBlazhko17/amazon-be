import { Module } from '@nestjs/common';

import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	controllers: [UsersController],
	providers: [UserService, UserRepository],
	exports: [UserService, UserRepository]
})
export class UserModule {}
