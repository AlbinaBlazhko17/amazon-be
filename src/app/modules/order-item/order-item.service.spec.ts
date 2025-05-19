import { Test, TestingModule } from '@nestjs/testing';

import { OrderItemRepository } from './order-item.repository';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
	let service: OrderItemService;
	let repository: OrderItemRepository;

	const mockOrderItemRepository = {
		findById: jest.fn(),
		create: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrderItemService,
				{
					provide: OrderItemRepository,
					useValue: mockOrderItemRepository
				}
			]
		}).compile();

		service = module.get<OrderItemService>(OrderItemService);
		repository = module.get<OrderItemRepository>(OrderItemRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findById', () => {
		it('should call repository findById with correct id', async () => {
			const id = 1;
			const expectedResult = { id, orderId: 1, productId: 1, quantity: 2 };
			mockOrderItemRepository.findById.mockResolvedValue(expectedResult);

			const result = await service.findById(id);

			expect(repository.findById).toHaveBeenCalledWith(id);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('create', () => {
		it('should call repository create with correct parameters', async () => {
			const orderId = 1;
			const productId = 2;
			const quantity = 3;
			const expectedResult = { id: 1, orderId, productId, quantity };
			mockOrderItemRepository.create.mockResolvedValue(expectedResult);

			const result = await service.create(orderId, productId, quantity);

			expect(repository.create).toHaveBeenCalledWith(orderId, productId, quantity);
			expect(result).toEqual(expectedResult);
		});
	});
});
