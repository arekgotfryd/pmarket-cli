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
    .option("-l, --ls <question filter>", "List available markets with question filter. Usage: poly-cli -l <question filter>")
    .option("-b, --buy <args...>", "Market buy token. Usage: poly-cli -b <token id> <amount in dollars> <price>")
    .parse(process.argv);

  //show help if no arguments are passed
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }


  const options = program.opts();
  console.log(options);
  //list all markets matching filter
  if (options.ls) {
    console.log(options.ls);
    const markets = await polymarketService.getMarkets();
    console.table(markets.filter(market => market.question.toLowerCase().includes(options.ls.toLowerCase())));
  }
  //buy token
  if (options.buy && options.buy.length == 3) {
    const token_id = options.buy[0];
    const amountInDollars = +options.buy[1];
    const price = +options.buy[2];
    const order = await polymarketService.marketOrder(token_id, amountInDollars, price);
    console.log(order);
  }
}
bootstrap();

