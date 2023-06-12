import { PolymarketService } from "../polymarket.service";
import { Strategy } from "./strategy";

export class OrderBookStrategy implements Strategy {
    constructor(private polymarketService: PolymarketService) { }
    async execute(options: { orderBook: string }): Promise<void> {
        try {
            const orderBook = await this.polymarketService.getOrderBook(options.orderBook);
            console.log(orderBook);
        } catch (e) {
            console.error(e);
        }
    }
}