import { Injectable } from "@nestjs/common";
import { ClobClient } from "@polymarket/clob-client";
import {
  ApiKeyCreds,
  Chain,
  OrderType,
  Side,
} from "@polymarket/clob-client/dist/types";
import { ethers } from "ethers";
import { ConfigService } from "./config.service";
let creds: ApiKeyCreds;
const CLOB_API_ENDPOINT = "https://clob.polymarket.com/";
const GAMMA_API_ENDPOINT = "https://gamma-api.polymarket.com/";
interface Token {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

interface Rewards {
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
      this.signer,
      creds,
      2,
      this.configService.get("funderAddress")
    );
  }
  async fetchAllMarkets(): Promise<Market[]> {
    let allMarkets: Market[] = [];
    let nextCursor = ""; // start from the beginning

    while (true) {
      const response: MarketsResponse = await this.clobClient.getMarkets(
        nextCursor
      );

      // Add the newly fetched markets to the full list
      allMarkets.push(...response.data);

      // Check if we've reached the end
      if (response.next_cursor === "LTE=" || !response.next_cursor) {
        break;
      }

      // Update nextCursor to fetch the next page
      nextCursor = response.next_cursor;
    }

    return allMarkets;
  }

  async getMarketsAcceptingOrders(): Promise<any> {
    const markets = await this.fetchAllMarkets();
    return markets
      .filter((market) => !market.closed && market.active)
      .map((market) => {
        return {
          yes: market.tokens[0],
          no: market.tokens[1],
          question: market.question,
        };
      });
  }

  async marketOrder(
    tokenID: string,
    side: Side,
    amount: number,
    price: number
  ): Promise<any> {
    //if we buy, we need to convert amount in dollars to amount in tokens
    if (side === Side.BUY) {
      amount = Math.floor(amount / price);
    }
    const orderBook = await this.clobClient.getOrderBook(tokenID);
    console.log(orderBook);
    console.log(side);
    console.log("Amount of shares/tokens: " + amount);
    console.log("Price" + price);
    const marketOrder = await this.clobClient.createOrder({
      tokenID: tokenID,
      price: price,
      side: side,
      size: amount,
      feeRateBps: 0,
      nonce: 0,
      expiration: 0,
    });
    console.log(marketOrder);
    let resp;
    if (side === Side.BUY) {
      //fill or kill
      resp = await this.clobClient.postOrder(marketOrder, OrderType.GTC);
    } else if (side === Side.SELL) {
      //good till cancelled
      resp = await this.clobClient.postOrder(marketOrder, OrderType.GTC);
    }
    return resp;
  }

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
