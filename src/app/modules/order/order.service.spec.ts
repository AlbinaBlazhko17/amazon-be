import { Test, TestingModule } from '@nestjs/testing';

import { OrderStatus } from '@prisma/client';

import { CreateOrderItemDto } from './interfaces/create-order-item.dto';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { PaginationQueryDto } from '@/common/pagination/dto/pagination-query.dto';

describe('OrderService', () => {
	let service: OrderService;
	let repository: OrderRepository;

	const mockOrderRepository = {
		findAll: jest.fn(),
		findById: jest.fn(),
		findByUserId: jest.fn(),
		create: jest.fn(),
		delete: jest.fn(),
		updateStatus: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrderService,
				{
					provide: OrderRepository,
					useValue: mockOrderRepository
				}
			]
		}).compile();

		service = module.get<OrderService>(OrderService);
		repository = module.get<OrderRepository>(OrderRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should call repository.findAll with correct params', async () => {
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: { total: 0 } };
			mockOrderRepository.findAll.mockResolvedValue(expectedResult);

			const result = await service.findAll(paginationQueryDto);

			expect(repository.findAll).toHaveBeenCalledWith(paginationQueryDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('findById', () => {
		it('should call repository.findById with correct id', async () => {
			const id = 1;
			const expectedOrder = { id, status: OrderStatus.PENDING };
			mockOrderRepository.findById.mockResolvedValue(expectedOrder);

			const result = await service.findById(id);

			expect(repository.findById).toHaveBeenCalledWith(id);
			expect(result).toEqual(expectedOrder);
		});
	});

	describe('findByUserId', () => {
		it('should call repository.findByUserId with correct params', async () => {
			const userId = 1;
			const paginationQueryDto: PaginationQueryDto = { skip: 1, take: 10 };
			const expectedResult = { data: [], meta: { total: 0 } };
			mockOrderRepository.findByUserId.mockResolvedValue(expectedResult);

			const result = await service.findByUserId(userId, paginationQueryDto);

			expect(repository.findByUserId).toHaveBeenCalledWith(userId, paginationQueryDto);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('create', () => {
		it('should call repository.create with correct params', async () => {
			const userId = 1;
			const orderItemsData: CreateOrderItemDto[] = [{ productId: 1, quantity: 2 }];
			const expectedOrder = { id: 1, status: OrderStatus.PENDING };
			mockOrderRepository.create.mockResolvedValue(expectedOrder);

			const result = await service.create(userId, orderItemsData);

			expect(repository.create).toHaveBeenCalledWith(userId, orderItemsData);
			expect(result).toEqual(expectedOrder);
		});
	});

	describe('updateStatus', () => {
		it('should call repository.updateStatus with correct params', async () => {
			const id = 1;
			const status = OrderStatus.SHIPPED;
			const expectedOrder = { id, status };
			mockOrderRepository.updateStatus.mockResolvedValue(expectedOrder);

			const result = await service.updateStatus(id, status);

			expect(repository.updateStatus).toHaveBeenCalledWith(id, status);
			expect(result).toEqual(expectedOrder);
		});
	});
});
