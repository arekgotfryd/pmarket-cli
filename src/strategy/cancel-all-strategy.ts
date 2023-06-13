import { PolymarketService } from "src/services/polymarket.service";
import { Strategy } from "./strategy";

export class CancelAllStrategy implements Strategy {
    constructor(private polymarketService: PolymarketService) { }
    async execute(): Promise<void> {
        try {
            await this.polymarketService.cancelAll();
        } catch (e) {
            console.error(e);
        }
    }
}