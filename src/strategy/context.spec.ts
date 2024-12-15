// import { Test } from '@nestjs/testing';
// import { ContractService } from '../services/contract.service';
// import { PolymarketService } from '../services/polymarket.service';
// import { Context } from './context';
// import { ConfigService } from '../services/config.service';
// import { setAndExecuteStrategy } from '../utils';
// import { ethers } from 'ethers';

// describe('Context', () => {
//     let polymarketService: PolymarketService;
//     let contractService: ContractService;
//     let context: Context;

//     beforeAll(async () => {
//         //mock conifg service
//         const configService = {
//             get: (key: string) => {
//                 if (key === "privateKey") {
//                     const wallet = ethers.Wallet.createRandom();
//                     const privateKey = wallet.privateKey;
//                     return privateKey;
//                 } else {
//                     return "something else"
//                 }
//             },
//             getCreds: () => {
//                 return {
//                     key: 'something',
//                     secret: 'secret',
//                     passphrase: 'passphrase'
//                 }
//             }
//         };
//         const moduleRef = await Test.createTestingModule({
//             providers: [PolymarketService, ContractService, ConfigService],
//         }).overrideProvider(ConfigService)
//             .useValue(configService).compile();

//         polymarketService = moduleRef.get<PolymarketService>(PolymarketService);
//         contractService = moduleRef.get<ContractService>(ContractService);
//         context = new Context(polymarketService, contractService);
//         jest.spyOn(polymarketService, 'getMarketsAcceptingOrders').mockImplementation(() => Promise.resolve([]));
//         jest.spyOn(polymarketService, 'marketOrder').mockImplementation(() => Promise.resolve({}));
//         jest.spyOn(polymarketService, 'getOrderBook').mockImplementation(() => Promise.resolve({}));
//         jest.spyOn(polymarketService, 'cancelAll').mockImplementation(() => Promise.resolve({}));
//         jest.spyOn(polymarketService, 'getApiKeys').mockImplementation(() => Promise.resolve({} as any));
//         jest.spyOn(contractService, 'setAllowance').mockImplementation(() => Promise.resolve({}));
//     });

//     it('should use ListStrategy', () => {
//         const options = { list: 'test' }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.getMarketsAcceptingOrders).toHaveBeenCalled();
//     });

//     it('should use BuyStrategy', () => {
//         const options = { buy: ['tokenId', '30', '0.6'] }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.marketOrder).toHaveBeenCalled();
//     });

//     it('should use SellStrategy', () => {
//         const options = { sell: ['tokenId', '100', '0.99'] }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.marketOrder).toHaveBeenCalled();
//     });

//     it('should use AllowanceStrategy', () => {
//         const options = { allowance: '100' }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(contractService.setAllowance).toHaveBeenCalled();
//     });

//     it('should use OrderBookStrategy', () => {
//         const options = { orderBook: 'tokenId' }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.getOrderBook).toHaveBeenCalled();
//     });

//     it('should use CancelAllStrategy', () => {
//         const options = { cancelAll: true }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.cancelAll).toHaveBeenCalled();
//     });

//     it('should use ApiKeysStrategy', () => {
//         const options = { keys: true }
//         const strategy = context.determineStrategy(options);
//         setAndExecuteStrategy(strategy, options, context);
//         expect(polymarketService.getApiKeys).toHaveBeenCalled();
//     });

// });