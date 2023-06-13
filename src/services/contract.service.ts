import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import { usdcContractABI } from "../abi/usdc";
import { ConfigService } from "./config.service";

@Injectable()
export class ContractService {
    polygonProvider: ethers.providers.JsonRpcProvider;
    wallet: ethers.Wallet;

    constructor(private configService: ConfigService) {
        this.polygonProvider = new ethers.providers.JsonRpcProvider(
            this.configService.get("rpcProvider")
        );
        this.wallet = new ethers.Wallet(
            this.configService.get("privateKey"),
            this.polygonProvider
        );
    }

    async setAllowance(amountOfAllowedUSDC: number): Promise<any> {
        const currentBlockGasLimit = await this.getBlockGasLimit();
        const currentGasPrice = await this.polygonProvider.getGasPrice();
        const usdcContractAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
        const usdcContract = new ethers.Contract(usdcContractAddress, usdcContractABI, this.wallet);
        const spenderAddress = '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E';
        const allowanceValue = ethers.utils.parseUnits(amountOfAllowedUSDC.toString(), '6');
        const approveResponse = await usdcContract.approve(spenderAddress, allowanceValue, { gasLimit: currentBlockGasLimit, gasPrice: currentGasPrice })
        return approveResponse;
    }

    async getBlockGasLimit() {
        const blockNumber = await this.polygonProvider.getBlockNumber();
        // Get the latest block
        const block = await this.polygonProvider.getBlock(blockNumber);
        // Access the gas limit of the block
        const blockGasLimit = block.gasLimit;
        console.log('Block Gas Limit:', blockGasLimit.toString());
    }

}
