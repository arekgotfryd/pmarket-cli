import { PolymarketService } from "src/services/polymarket.service";
import { Strategy } from "./strategy";

export class ApiKeysStrategy implements Strategy {
    constructor(private polymarketService: PolymarketService) { }
    async execute(): Promise<void> {
        const apiKeys = await this.polymarketService.getApiKeys();
        console.log(apiKeys);
    }
}