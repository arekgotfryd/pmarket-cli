import { ContractService } from "../services/contract.service";
import { Strategy } from "./strategy";

export class AllowanceStrategy implements Strategy {
    constructor(private contractService: ContractService) { }
    async execute(options: { allowance: string }): Promise<void> {
        try {
            const allowance = await this.contractService.setAllowance(+options.allowance);
            console.log(allowance);
        } catch (e) {
            console.error(e);
        }
    }
}