import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { PolymarketService } from './polymarket.service';
import { Command } from 'commander'
const figlet = require("figlet");

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // load environment variables from .env file
  dotenv.config();
  const polymarketService = app.get(PolymarketService);
  console.log(figlet.textSync("Poly-CLI"));
  const program = new Command();
  program
    .version("1.0.0")
    .description("A CLI to trade on Polymarket")
    .option("-l, --ls <question filter>", "List available markets with question filter")
    .parse(process.argv);


  const options = program.opts();
  console.log(options);
  //list all markets matching filter
  if(options.ls) {
    console.log(options.ls);
    const markets = await polymarketService.getMarkets();
    console.table(markets.filter(market => market.question.toLowerCase().includes(options.ls.toLowerCase())));
  }
}
bootstrap();

