import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PolymarketService } from './polymarket.service';
import { Command } from 'commander'
import { Side } from '@polymarket/clob-client';
import { ContractService } from './contract.service';
import * as figlet from "figlet";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const polymarketService = app.get(PolymarketService);
  const contractService = app.get(ContractService);
  console.log(figlet.textSync("Poly-CLI"));
  const program = new Command();
  program
    .version("1.0.0")
    .description("A CLI to trade on Polymarket")
    .option("-l, --list <question filter>", "List available markets with question filter. Usage: poly-cli -l <question filter>")
    .option("-b, --buy <args...>", "Buy token. Usage: poly-cli -b <token id> <amount in USDC> <price>")
    .option("-s, --sell <args...>", "Sell token. Usage: poly-cli -b <token id> <amount of tokens> <price>")
    // .option("-p, --positions", "Show active positions. Usage: poly-cli -p")
    .option("-a, --allowance <amount in USDC>", "Set USDC allowance for CTFExchange contract. Usage: poly-cli -a <amount in USDC>")
    .option("-o, --orderBook <tokenId>", "Show order book for specific tokenId. Usage: poly-cli -o <token id>")
    .parse(process.argv);

  //show help if no arguments are passed
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }


  const options = program.opts();
  // console.log(options);
  //list all markets matching filter
  if (options.list) {
    const markets = await polymarketService.getMarketsAcceptingOrders();
    console.log(markets.filter(market => market.question.toLowerCase().includes(options.list.toLowerCase())));
  }
  //buy token
  if (options.buy && options.buy.length == 3) {
    const token_id = options.buy[0];
    const amountInDollars = +options.buy[1];
    const price = +options.buy[2];
    try {
      const order = await polymarketService.marketOrder(token_id, Side.BUY, amountInDollars, price);
      console.log(order);
    } catch (error) {
      console.error(error);
    }
  }
  //sell token
  if (options.sell && options.sell.length == 3) {
    const token_id = options.sell[0];
    const amountOfTokens = +options.sell[1];
    const price = +options.sell[2];
    try {
      const order = await polymarketService.marketOrder(token_id, Side.SELL, amountOfTokens, price);
      console.log(order);
    } catch (e) {
      console.error(e);
    }
  }
  //set allowance
  if (options.allowance) {
    try {
      const allowance = await contractService.setAllowance(+options.allowance);
      console.log(allowance);
    } catch (e) {
      console.error(e);
    }
  }
  //show order book for specific token
  if (options.orderBook) {
    try {
      const orderBook = await polymarketService.getOrderBook(options.orderBook);
      console.log(orderBook);
    } catch (e) {
      console.error(e);
    }
  }
  //show positions
  if (options.positions) {
    // try {
    //   const positions = await polymarketService.getPositions();
    //   console.table(positions);
    // } catch (e) {
    //   console.error(e);
    // }
  }
}
bootstrap();

