import { Module } from '@nestjs/common';

import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';
import { PaginationModule } from '@/common/pagination/pagination.module';
import { PaginationService } from '@/common/pagination/pagination.service';

@Module({
	imports: [PaginationModule],
	controllers: [ReviewController],
	providers: [ReviewService, ReviewRepository, PaginationService],
	exports: [ReviewService]
})
export class ReviewModule {}
