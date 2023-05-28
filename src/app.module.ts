import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PolymarketService } from './polymarket.service';
import { ConfigService } from './config.service';

@Module({
  imports: [HttpModule],
  providers: [PolymarketService, ConfigService],
})
export class AppModule {}
