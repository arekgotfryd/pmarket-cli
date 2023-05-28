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
    .option("-l, --ls", "List available markets")
    .parse(process.argv);

  const options = program.opts();
  console.log(options);
  if(options.ls) {
    const markets = await polymarketService.getMarkets();
    console.table(markets);
  }
}
bootstrap();

