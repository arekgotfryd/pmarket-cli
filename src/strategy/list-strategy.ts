import { PolymarketService } from "../services/polymarket.service";
import { Strategy } from "./strategy";
import { Inject, Injectable } from "@nestjs/common";

export class ListStrategy implements Strategy {
    constructor(@Inject(PolymarketService)
    private readonly polymarketService: PolymarketService) { }

    async execute(options: { list: string }): Promise<void> {
        const markets = await this.polymarketService.getMarketsAcceptingOrders();
        console.log(markets.filter(market => market.question.toLowerCase().includes(options.list.toLowerCase())));
    }
}