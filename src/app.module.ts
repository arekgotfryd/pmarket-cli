import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PolymarketService } from './polymarket.service';
import { ConfigService } from './config.service';
import { ContractService } from './contract.service';

@Module({
  imports: [HttpModule],
  providers: [PolymarketService, ConfigService, ContractService],
})
export class AppModule { }
