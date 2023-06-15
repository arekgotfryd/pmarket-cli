#! /usr/bin/env node
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PolymarketService } from './services/polymarket.service';
import { getProgram } from './program';
import { ContractService } from './services/contract.service';
import * as figlet from "figlet";
import { Context } from './strategy/context';
import { setAndExecuteStrategy } from './utils';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule,{ logger: false });
  const polymarketService = app.get(PolymarketService);
  const contractService = app.get(ContractService);
  console.log(figlet.textSync("PolyCLI"));
  const program = getProgram();

  //show help if no arguments are passed
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
  //parsed options
  const options = program.parse(process.argv).opts();

  //strategy pattern to handle different commands
  const context = new Context(polymarketService, contractService);
  const strategy = context.determineStrategy(options);
  if(strategy) {
    setAndExecuteStrategy(strategy, options, context);
  }
}
bootstrap();

