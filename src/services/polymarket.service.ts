import { Injectable } from "@nestjs/common";
import { ClobClient } from "@polymarket/clob-client";
import {
  ApiKeyCreds,
  Chain,
  OrderType,
  Side,
} from "@polymarket/clob-client/dist/types";
import axios from "axios";
import { ethers } from "ethers";
import { ConfigService } from "./config.service";
let creds: ApiKeyCreds;
const CLOB_API_ENDPOINT = "https://clob.polymarket.com/";
const GAMMA_API_ENDPOINT = "https://gamma-api.polymarket.com/";
type FeeResponse = { side: "taker" | "maker"; fee: number };
interface Token {
  // Define token properties as per documentation
  // Example placeholder fields:
  token_id: string;
  symbol: string;
  price: string;
}

interface Rewards {
  // Define rewards properties as per documentation
  // Example placeholder fields:
  incentiveProgram: string;
  totalRewardPool: string;
}

export interface Market {
  condition_id: string;
  question_id: string;
  tokens: [Token, Token]; // exactly two tokens
  rewards: Rewards;
  minimum_order_size: string;
  minimum_tick_size: string;
  description: string;
  category: string;
  end_date_iso: string;
  game_start_time: string;
  question: string;
  market_slug: string;
  min_incentive_size: string;
  max_incentive_spread: string;
  active: boolean;
  closed: boolean;
  seconds_delay: number;
  icon: string;
  fpmm: string;
}
interface MarketsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: Market[];
}
@Injectable()
export class PolymarketService {
  clobClient: ClobClient;
  signer: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const provider = new ethers.providers.JsonRpcProvider(
      this.configService.get("rpcProvider")
    );
    try {
      this.signer = new ethers.Wallet(
        this.configService.get("privateKey"),
        provider
      );
    } catch (error) {
      console.log(
        "Please provide valid private key and rpc provider in config.json file"
      );
    }

    creds = this.configService.getCreds();
    this.clobClient = new ClobClient(
      CLOB_API_ENDPOINT,
      Chain.POLYGON,
      this.signer
    );
  }
async fetchAllMarkets(): Promise<Market[]> {
  let allMarkets: Market[] = [];
  let nextCursor = ''; // start from the beginning

  while (true) {
    const response: MarketsResponse = await this.clobClient.getMarkets(nextCursor);

    // Add the newly fetched markets to the full list
    allMarkets.push(...response.data);

    // Check if we've reached the end
    if (response.next_cursor === 'LTE=' || !response.next_cursor) {
      break;
    }

    // Update nextCursor to fetch the next page
    nextCursor = response.next_cursor;
  }

  return allMarkets;
}


  async getActiveMarkets() {
    const response = await axios.get(
      `${GAMMA_API_ENDPOINT}markets?closed=false&limit=10000`
    );
    return response.data;
  }

  async getMarketsAcceptingOrders(): Promise<any> {
    const markets = await this.fetchAllMarkets();
    return markets
      .filter((market) => !market.closed && market.active)
      .map((market) => {
        return {
          token_0:market.tokens[0].token_id, 
          token_1: market.tokens[1].token_id,
          question: market.question,
        };
      });
  }

  // async determineMakerOrTakerFee(
  //   tokenId: string,
  //   side: Side,
  //   size: number,
  //   orderBook: any,
  //   price: number
  // ): Promise<{ side: "taker" | "maker"; fee: number }> {
  //   const resp: FeeResponse = {
  //     side: "taker",
  //     fee: 0,
  //   };
  //   if (side === Side.SELL) {
  //     //check bids
  //     const bids = orderBook.bids;
  //     const bidsWithPriceAsNumber = bids.map((bid) => {
  //       return { price: parseFloat(bid.price), size: parseFloat(bid.size) };
  //     });
  //     const bidsWithPriceHigherThanPrice = bidsWithPriceAsNumber.filter(
  //       (bid) => bid.price >= price
  //     );
  //     const sumOfSizeOfBidsWithPriceHigherThanPrice =
  //       bidsWithPriceHigherThanPrice.reduce((acc, val) => val.size, 0);
  //     if (sumOfSizeOfBidsWithPriceHigherThanPrice >= size) {
  //       //get taker
  //       const takerFee = await this.getFeeRateBps(tokenId, "taker");
  //       resp.side = "taker";
  //       resp.fee = takerFee;
  //       return resp;
  //     } else {
  //       const makerFee = await this.getFeeRateBps(tokenId, "maker");
  //       resp.side = "maker";
  //       resp.fee = makerFee;
  //       return resp;
  //     }
  //   } else if (side === Side.BUY) {
  //     //check asks
  //     const asks = orderBook.asks;
  //     const asksWithPriceAsNumber = asks.map((ask) => {
  //       return { price: parseFloat(ask.price), size: parseFloat(ask.size) };
  //     });
  //     const asksWithPriceLowerThanPrice = asksWithPriceAsNumber.filter(
  //       (ask) => ask.price <= price
  //     );
  //     const sumOfSizeOfAsksWithPriceLowerThanPrice =
  //       asksWithPriceLowerThanPrice.reduce((acc, val) => acc + val.size, 0);
  //     if (sumOfSizeOfAsksWithPriceLowerThanPrice >= size) {
  //       //get taker
  //       const takerFee = await this.getFeeRateBps(tokenId, "taker");
  //       resp.side = "taker";
  //       resp.fee = takerFee;
  //       return resp;
  //     } else {
  //       const makerFee = await this.getFeeRateBps(tokenId, "maker");
  //       resp.side = "maker";
  //       resp.fee = makerFee;
  //       return resp;
  //     }
  //   }
  // }

  // async getFeeRateBps(
  //   tokenId: string,
  //   side: "taker" | "maker"
  // ): Promise<number> {
  //   const markets = await this.fetchAllMarkets();
  //   const market = markets.filter((market) => {
  //     return (
  //       market.tokens
  //         .map((token) => {
  //           return token.token_id;
  //         })
  //         .indexOf(tokenId) >= 0
  //     );
  //   })[0];
  //   return side === "taker" ? market.taker_base_fee : market.maker_base_fee;
  // }

  // async marketOrder(
  //   tokenID: string,
  //   side: Side,
  //   amount: number,
  //   price: number
  // ): Promise<any> {
  //   //if we buy, we need to convert amount in dollars to amount in tokens
  //   if (side === Side.BUY) {
  //     amount = Math.floor(amount / price);
  //   }
  //   const orderBook = await this.clobClient.getOrderBook(tokenID);
  //   console.log(orderBook);
  //   const feeResponse: FeeResponse = await this.determineMakerOrTakerFee(
  //     tokenID,
  //     side,
  //     amount,
  //     orderBook,
  //     price
  //   );
  //   console.log("Fee rate: " + feeResponse.fee);
  //   console.log(side);
  //   console.log("Amount of shares/tokens: " + amount);
  //   console.log("Price" + price);
  //   const marketOrder = await this.clobClient.createOrder({
  //     tokenID: tokenID,
  //     price: price,
  //     side: side,
  //     size: amount,
  //     feeRateBps: feeResponse.fee,
  //     nonce: 0,
  //     expiration: 0,
  //   });
  //   console.log(marketOrder);
  //   let resp;
  //   if (feeResponse.side === "taker" && side === Side.BUY) {
  //     //fill or kill
  //     resp = await this.clobClient.postOrder(marketOrder, OrderType.FOK);
  //   } else if (feeResponse.side === "taker" && side === Side.SELL) {
  //     //good till cancelled
  //     resp = await this.clobClient.postOrder(marketOrder, OrderType.GTC);
  //   } else if (feeResponse.side === "maker") {
  //     //good till cancelled
  //     resp = await this.clobClient.postOrder(marketOrder, OrderType.GTC);
  //   }
  //   return resp;
  // }

  async getOrderBook(tokenId: string): Promise<any> {
    return this.clobClient.getOrderBook(tokenId);
  }

  async cancelAll(): Promise<any> {
    const resp = await this.clobClient.cancelAll();
    console.log(resp);
    return resp;
  }

  async getApiKeys(): Promise<ApiKeyCreds> {
    const apiKeys = await this.clobClient.deriveApiKey();
    if (!apiKeys["error"]) {
      return apiKeys;
    } else {
      return this.clobClient.createApiKey();
    }
  }
}
