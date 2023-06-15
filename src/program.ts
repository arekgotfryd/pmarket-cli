import { Command } from 'commander'

export const getProgram = (): Command => {
  const program = new Command();
  program
    .version("0.7.0")
    .description("Command line interface for Polymarket")
    .option("-l, --list <question filter>", "List available markets with question filter. Usage: polycli -l <question filter>")
    .option("-b, --buy <args...>", "Buy token order. Usage: polycli -b <token id> <amount in USDC> <price>")
    .option("-s, --sell <args...>", "Sell token order. Usage: polycli -s <token id> <amount of tokens> <price>")
    .option("-a, --allowance <amount in USDC>", "Set USDC allowance for CTFExchange contract. Usage: polycli -a <amount in USDC>")
    .option("-o, --orderBook <tokenId>", "Show order book for specific tokenId. Usage: polycli -o <token id>")
    .option("-c, --cancelAll", "Cancel all open orders. Usage: polycli -c")
    .option("-k, --keys", "Get or generate api keys. Usage: polycli -k")
  return program;
}