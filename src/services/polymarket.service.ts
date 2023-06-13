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
type FeeResponse = { side: 'taker' | 'maker', fee: number };
@Injectable()
export class PolymarketService {
  clobClient: ClobClient;
  polygonProvider;

  constructor(private configService: ConfigService) {
    const provider = new ethers.providers.JsonRpcProvider(
      this.configService.get("rpcProvider")
    );
    const signer = new ethers.Wallet(
      this.configService.get("privateKey"),
      provider
    );
    creds = this.configService.getCreds();
    this.clobClient = new ClobClient(
      CLOB_API_ENDPOINT,
      Chain.POLYGON,
      signer,
      creds
    );
  }

  async getMarkets(): Promise<any> {
    const response = await axios.get(
      `${CLOB_API_ENDPOINT}markets`,
    );
    return response.data;
  }

  async getMarketsAcceptingOrders(): Promise<any> {
    const markets = await this.getMarkets();
    return markets.filter(market => market.accepting_orders).map((market) => {
      return { token_0: market.tokens[0], token_1: market.tokens[1], question: market.question };
    });
  }

  async determineMakerOrTakerFee(tokenId: string, side: Side, size: number, orderBook: any, price: number): Promise<{ side: 'taker' | 'maker', fee: number }> {

    const resp: FeeResponse = {
      side: 'taker',
      fee: 0
    }
    if (side === Side.SELL) {
      //check bids
      const bids = orderBook.bids;
      const bidsWithPriceAsNumber = bids.map((bid) => { return { price: parseFloat(bid.price), size: parseFloat(bid.size) } });
      const bidsWithPriceHigherThanPrice = bidsWithPriceAsNumber.filter((bid) => bid.price >= price);
      const sumOfSizeOfBidsWithPriceHigherThanPrice = bidsWithPriceHigherThanPrice.reduce((acc, val) => val.size, 0);
      if (sumOfSizeOfBidsWithPriceHigherThanPrice >= size) {
        //get taker
        const takerFee = await this.getFeeRateBps(tokenId, 'taker');
        resp.side = 'taker';
        resp.fee = takerFee;
        return resp;
      } else {
        const makerFee = await this.getFeeRateBps(tokenId, 'maker');
        resp.side = 'maker';
        resp.fee = makerFee;
        return resp;
      }
    } else if (side === Side.BUY) {
      //check asks
      const asks = orderBook.asks;
      const asksWithPriceAsNumber = asks.map((ask) => { return { price: parseFloat(ask.price), size: parseFloat(ask.size) } });
      const asksWithPriceLowerThanPrice = asksWithPriceAsNumber.filter((ask) => ask.price <= price);
      const sumOfSizeOfAsksWithPriceLowerThanPrice = asksWithPriceLowerThanPrice.reduce((acc, val) => acc + val.size, 0);
      if (sumOfSizeOfAsksWithPriceLowerThanPrice >= size) {
        //get taker
        const takerFee = await this.getFeeRateBps(tokenId, 'taker');
        // return takerFee;
        resp.side = 'taker';
        resp.fee = takerFee;
        return resp;
      } else {
        const makerFee = await this.getFeeRateBps(tokenId, 'maker');
        // return makerFee;
        resp.side = 'maker';
        resp.fee = makerFee;
        return resp;
      }

    }
  }

  async getFeeRateBps(tokenId: string, side: 'taker' | 'maker'): Promise<number> {
    const markets = await this.getMarkets();
    const market = markets
      .filter(market => { return market.tokens.map(token => { return token.token_id }).indexOf(tokenId) >= 0 })[0];
    return side === 'taker' ? market.taker_base_fee : market.maker_base_fee;
  }

  async marketOrder(tokenID: string, side: Side, amount: number, price: number,): Promise<any> {
    //if we buy, we need to convert amount in dollars to amount in tokens
    if (side === Side.BUY) {
      amount = Math.floor(amount / price);
    }
    const orderBook = await this.clobClient.getOrderBook(
      tokenID,
    );
    console.log(orderBook);
    const feeRepsonse: FeeResponse = await this.determineMakerOrTakerFee(tokenID, side, amount, orderBook, price)
    console.log("Fee rate: " + feeRepsonse.fee);
    console.log(side);
    console.log(amount);
    console.log(price);
    const marketOrder = await this.clobClient.createOrder({
      tokenID: tokenID,
      price: price,
      side: side,
      size: amount,
      feeRateBps: feeRepsonse.fee,
      nonce: 0,
      expiration: 0,
    });
    let resp;
    if (feeRepsonse.side === 'taker') {
      //fill or kill
      resp = await this.clobClient.postOrder(marketOrder, OrderType.FOK);
    } else if(feeRepsonse.side === 'maker'){
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

}
