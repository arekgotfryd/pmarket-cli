import { Command } from 'commander'
import { version } from '../package.json'

export const getProgram = (): Command => {
  const program = new Command();
  program
    .version(version)
    .description("Command line interface for Polymarket")
    .option("-l, --list <question filter>", "List available markets with question filter. Usage: pmarket-cli -l <question filter>")
    .option("-b, --buy <args...>", "Buy token order. Usage: pmarket-cli -b <token id> <amount in USDC> <price>")
    .option("-s, --sell <args...>", "Sell token order. Usage: pmarket-cli -s <token id> <amount of tokens> <price>")
    .option("-a, --allowance <amount in USDC>", "Set USDC allowance for CTFExchange contract. Usage: pmarket-cli -a <amount in USDC>")
    .option("-o, --orderBook <tokenId>", "Show order book for specific tokenId. Usage: pmarket-cli -o <token id>")
    .option("-c, --cancelAll", "Cancel all open orders. Usage: pmarket-cli -c")
    .option("-k, --keys", "Get or generate api keys. Usage: pmarket-cli -k")
  return program;
}