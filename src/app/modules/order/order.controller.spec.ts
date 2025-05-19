import { Test, TestingModule } from '@nestjs/testing';

import { OrderStatus } from '@prisma/client';

import { CreateOrderItemDto } from './interfaces/create-order-item.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

describe('OrderController', () => {
	let controller: OrderController;
	let orderService: OrderService;

	const mockOrderService = {
		findAll: jest.fn(),
		create: jest.fn(),
		findById: jest.fn(),
		delete: jest.fn(),
		updateStatus: jest.fn(),
		findByUserId: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OrderController],
			providers: [
				{
					provide: OrderService,
					useValue: mockOrderService
				}
			]
		}).compile();

		controller = module.get<OrderController>(OrderController);
		orderService = module.get<OrderService>(OrderService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should call orderService.findAll with pagination query', async () => {
			const paginationQuery: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: { total: 0 } };

			mockOrderService.findAll.mockResolvedValue(expectedResult);

			const result = await controller.findAll(paginationQuery);

			expect(orderService.findAll).toHaveBeenCalledWith(paginationQuery);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('create', () => {
		it('should call orderService.create with userId and orderItemsData', async () => {
			const userId = 1;
			const orderItemsData: CreateOrderItemDto[] = [{ productId: 1, quantity: 2 }];
			const expectedResult = { id: 1, items: [] };

			mockOrderService.create.mockResolvedValue(expectedResult);

			const result = await controller.create(userId, orderItemsData);

			expect(orderService.create).toHaveBeenCalledWith(userId, orderItemsData);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findById', () => {
		it('should call orderService.findById with id', async () => {
			const orderId = 1;
			const expectedResult = { id: orderId, status: OrderStatus.PENDING };

			mockOrderService.findById.mockResolvedValue(expectedResult);

			const result = await controller.findById(orderId);

			expect(orderService.findById).toHaveBeenCalledWith(orderId);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('delete', () => {
		it('should call orderService.delete with id', async () => {
			const orderId = 1;

			await controller.delete(orderId);

			expect(orderService.delete).toHaveBeenCalledWith(orderId);
		});
	});

	describe('updateStatusToPayed', () => {
		it('should call orderService.updateStatus with id and PAYED status', async () => {
			const orderId = 1;
			const expectedResult = { id: orderId, status: OrderStatus.PAYED };

			mockOrderService.updateStatus.mockResolvedValue(expectedResult);

			const result = await controller.updateStatusToPayed(orderId);

			expect(orderService.updateStatus).toHaveBeenCalledWith(orderId, OrderStatus.PAYED);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('updateStatusToShipped', () => {
		it('should call orderService.updateStatus with id and SHIPPED status', async () => {
			const orderId = 1;
			const expectedResult = { id: orderId, status: OrderStatus.SHIPPED };

			mockOrderService.updateStatus.mockResolvedValue(expectedResult);

			const result = await controller.updateStatusToShipped(orderId);

			expect(orderService.updateStatus).toHaveBeenCalledWith(orderId, OrderStatus.SHIPPED);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('updateStatusToDelivered', () => {
		it('should call orderService.updateStatus with id and DELIVERED status', async () => {
			const orderId = 1;
			const expectedResult = { id: orderId, status: OrderStatus.DELIVERED };

			mockOrderService.updateStatus.mockResolvedValue(expectedResult);

			const result = await controller.updateStatusToDelivered(orderId);

			expect(orderService.updateStatus).toHaveBeenCalledWith(orderId, OrderStatus.DELIVERED);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findByUserId', () => {
		it('should call orderService.findByUserId with userId and pagination query', async () => {
			const userId = 1;
			const paginationQuery: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: { total: 0 } };

			mockOrderService.findByUserId.mockResolvedValue(expectedResult);

			const result = await controller.findByUserId(userId, paginationQuery);

			expect(orderService.findByUserId).toHaveBeenCalledWith(userId, paginationQuery);
			expect(result).toEqual(expectedResult);
		});
	});
});
