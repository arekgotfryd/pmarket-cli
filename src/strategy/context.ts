import { PolymarketService } from "../polymarket.service"
import { Strategy } from "./strategy"
import { ContractService } from "../contract.service"
import { ListStrategy } from "./list-strategy"
import { BuyStrategy } from "./buy-strategy"
import { SellStrategy } from "./sell-strategy"
import { AllowanceStrategy } from "./allowance-strategy"
import { OrderBookStrategy } from "./order-book-strategy"

export class Context {
    // The context maintains a reference to one of the strategy
    // objects. The context doesn't know the concrete class of a
    // strategy. It should work with all strategies via the
    // strategy interface.
    private strategy: Strategy
    constructor(private polymarketService: PolymarketService, private contractService: ContractService) { }

    // Usually the context accepts a strategy through the
    // constructor, and also provides a setter so that the
    // strategy can be switched at runtime.
    setStrategy = (strategy: Strategy): void => {
        this.strategy = strategy
    }

    // The context delegates some work to the strategy object
    // instead of implementing multiple versions of the
    // algorithm on its own.
    executeStrategy = (options: any): void => {
        this.strategy.execute(options)
    }

    determineStrategy = (options: any): Strategy => {
        let strategy: Strategy;
        //list all markets matching filter
        if (options.list) {
            strategy = new ListStrategy(this.polymarketService);
            //buy token
            if (options.buy && options.buy.length === 3) {
                strategy = new BuyStrategy(this.polymarketService);
            }
            //sell token
            if (options.sell && options.sell.length === 3) {
                strategy = new SellStrategy(this.polymarketService);
            }
            //set allowance
            if (options.allowance) {
                strategy = new AllowanceStrategy(this.contractService);
            }
            //show order book for specific token
            if (options.orderBook) {
                strategy = new OrderBookStrategy(this.polymarketService);
            }
            return strategy;
        }
    }
}
