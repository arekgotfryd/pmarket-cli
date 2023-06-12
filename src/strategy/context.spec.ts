import { Test } from '@nestjs/testing';
import { ContractService } from '../contract.service';
import { PolymarketService } from '../polymarket.service';
import { Context } from './context';
import { ConfigService } from '../config.service';

describe('Context', () => {
    let polymarketService: PolymarketService;
    let contractService: ContractService;
    let context: Context;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [PolymarketService, ContractService, ConfigService],
        })
            .compile();

        polymarketService = moduleRef.get<PolymarketService>(PolymarketService);
        contractService = moduleRef.get<ContractService>(ContractService);
        context = new Context(polymarketService, contractService);
        jest.spyOn(polymarketService, 'getMarketsAcceptingOrders').mockImplementation(() => Promise.resolve([]));
    });

    it('should use ListStrategy', () => {
        const options = { list: 'test' }
        const strategy = context.determineStrategy(options);
        context.setStrategy(strategy);
        context.executeStrategy(options);
        expect(polymarketService.getMarketsAcceptingOrders).toHaveBeenCalled();
    });
    // TODO: Generate tests for other strategies

});