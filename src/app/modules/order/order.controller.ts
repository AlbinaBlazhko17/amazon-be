import { Body, Controller, Delete, Get, Patch, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrderStatus } from '@prisma/client';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

import { CreateOrderItemDto } from './interfaces/create-order-item.dto';
import { OrderService } from './order.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

@ApiTags('order')
@ApiBearerAuth('JWT-auth')
@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Auth()
	@Get()
	@Version('1.0')
	@ApiOperation({ summary: 'Get all orders' })
	@ApiResponse({ status: 200, description: 'Return all orders' })
	async findAll(@Query() paginationQuery: PaginationQueryDto) {
		return this.orderService.findAll(paginationQuery);
	}

	@Auth()
	@Post('')
	@Version('1.0')
	@ApiOperation({ summary: 'Create order' })
	@ApiResponse({ status: 201, description: 'Order created' })
	async create(@CurrentUser('id') userId: number, @Body() orderItemsData: CreateOrderItemDto[]) {
		return this.orderService.create(userId, orderItemsData);
	}

	@Auth()
	@Get(':orderId')
	@Version('1.0')
	@ApiOperation({ summary: 'Get order by id' })
	@ApiResponse({ status: 200, description: 'Return order by id' })
	async findById(@Query('orderId') id: number) {
		return this.orderService.findById(id);
	}

	@Auth()
	@Delete(':orderId')
	@Version('1.0')
	@ApiOperation({ summary: 'Delete order' })
	@ApiResponse({ status: 204, description: 'Order deleted' })
	async delete(@Query('orderId') id: number) {
		await this.orderService.delete(id);
	}

	@Auth()
	@Patch(':orderId/payed')
	@Version('1.0')
	@ApiOperation({ summary: 'Update order status to payed' })
	@ApiResponse({ status: 200, description: 'Order status updated to payed' })
	async updateStatusToPayed(@Query('orderId') id: number) {
		return this.orderService.updateStatus(id, OrderStatus.PAYED);
	}

	@Auth()
	@Patch(':orderId/shipped')
	@Version('1.0')
	@ApiOperation({ summary: 'Update order status to shipped' })
	@ApiResponse({ status: 200, description: 'Order status updated to shipped' })
	async updateStatusToShipped(@Query('orderId') id: number) {
		return this.orderService.updateStatus(id, OrderStatus.SHIPPED);
	}

	@Auth()
	@Patch(':orderId/delivered')
	@Version('1.0')
	@ApiOperation({ summary: 'Update order status to delivered' })
	@ApiResponse({ status: 200, description: 'Order status updated to delivered' })
	async updateStatusToDelivered(@Query('orderId') id: number) {
		return this.orderService.updateStatus(id, OrderStatus.DELIVERED);
	}

	@Auth()
	@Get('/users/me/orders')
	@Version('1.0')
	@ApiOperation({ summary: 'Get orders by user id' })
	@ApiResponse({ status: 200, description: 'Return orders by user id' })
	async findByUserId(
		@CurrentUser('id') userId: number,
		@Query() paginationQuery: PaginationQueryDto
	) {
		return this.orderService.findByUserId(userId, paginationQuery);
	}
}
