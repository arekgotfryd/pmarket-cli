import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PolymarketService } from './services/polymarket.service';
import { ConfigService } from './services/config.service';
import { ContractService } from './services/contract.service';

@Module({
  imports: [HttpModule],
  providers: [PolymarketService, ConfigService, ContractService],
})
export class AppModule { }
