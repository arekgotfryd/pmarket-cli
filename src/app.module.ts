import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PolymarketService } from './polymarket.service';

@Module({
  imports: [HttpModule],
  providers: [PolymarketService],
})
export class AppModule {}
