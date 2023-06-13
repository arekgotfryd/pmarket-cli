import { Command } from 'commander'

export const getProgram = (): Command => {
  const program = new Command();
  program
    .version("0.7.0")
    .description("A CLI to trade on Polymarket")
    .option("-l, --list <question filter>", "List available markets with question filter. Usage: poly-cli -l <question filter>")
    .option("-b, --buy <args...>", "Buy token. Usage: poly-cli -b <token id> <amount in USDC> <price>")
    .option("-s, --sell <args...>", "Sell token. Usage: poly-cli -s <token id> <amount of tokens> <price>")
    .option("-a, --allowance <amount in USDC>", "Set USDC allowance for CTFExchange contract. Usage: poly-cli -a <amount in USDC>")
    .option("-o, --orderBook <tokenId>", "Show order book for specific tokenId. Usage: poly-cli -o <token id>")
    .option("-c, --cancelAll", "Cancel all open orders. Usage: poly-cli -c")
  return program;
}