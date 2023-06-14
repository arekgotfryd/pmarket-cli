import { Side } from '@polymarket/clob-client';
import { ConfigService } from './config.service';
import { PolymarketService } from './polymarket.service';
import { Test } from '@nestjs/testing';
import { ethers } from 'ethers';

const markets = [{
    "condition_id": "0xa00a22b16d602abf9ed695404df68a71ddd4ef05573bf9590de4f0fccf096c93",
    "question_id": "0xaf090077f0db7aa7f97051e04fcd764d86970004a37b3150ae7a681b5b3e495c",
    "tokens": [
        {
            "token_id": "9629446620718684243744463725282080039675086062123106562256171337393905586388",
            "outcome": "No"
        },
        {
            "token_id": "43232097181918994738032241755006123258571385315939394755006203919277954135565",
            "outcome": "Yes"
        }
    ],
    "rewards": {
        "min_size": 0,
        "max_spread": 0,
        "event_start_date": null,
        "event_end_date": null,
        "in_game_multiplier": 0,
        "reward_epoch": 0
    },
    "description": "This market will resolve to \"Yes\" if the Boston Celtics become the 2022-23 NBA Champion. Otherwise, this market will resolve to \"No\".\n\nIf it is determined at any point that it is impossible for the Celtics to be the 2022-23 NBA Champion based on the rules of the NBA (e.g. they're eliminated in the playoffs), this market will immediately resolve to \"No.\"\n\nIf this team is still in contention to become the champion and the champion still isn't determined by October 24, 2023, 11:59:59 PM ET, this market will resolve 50-50.",
    "question": "Will the Celtics be the 2022-23 NBA Champion?",
    "active": true,
    "closed": true,
    "end_date_iso": "2023-06-17",
    "game_start_time": null,
    "seconds_delay": 0,
    "minimum_order_size": "15",
    "minimum_tick_size": "0.01",
    "market_slug": "will-the-celtics-be-the-2022-23-nba-champion",
    "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/celtics.png",
    "fpmm": "0x34EC3128703f4aC2D990A04776Bd5A0E451f6088",
    "accepting_orders": false,
    "maker_base_fee": 0,
    "taker_base_fee": 0
}, {
    "condition_id": "0x757fe19cced3f2136ef1dc0e0163b9996a68a330a8d2338835e3b81a31fcac91",
    "question_id": "0x8c7336ccc387ba779bfa886a638e6d81ecfb315c4ebdd7b099f505a16ce5f860",
    "tokens": [
        {
            "token_id": "14811968980410449224099097755442778591369245152075435522945362809904270343154",
            "outcome": "Yes"
        },
        {
            "token_id": "57430235197990449398919000106517296481235279294973890917683113058548298509870",
            "outcome": "No"
        }
    ],
    "rewards": {
        "min_size": 0,
        "max_spread": 0,
        "event_start_date": null,
        "event_end_date": null,
        "in_game_multiplier": 0,
        "reward_epoch": 0
    },
    "description": "This market will resolve to “Yes” if Vivek Ramaswamy wins the 2024 nomination of the Republican Party for U.S. president. Otherwise, this market will resolve to “No”. \n\nThe resolution source for this market will be a consensus of official GOP sources, including https://www.gop.com. Any replacement of the nominee before election day will not change the resolution of the market.",
    "question": "Will Vivek Ramaswamy win the U.S. 2024 Republican presidential nomination?",
    "active": true,
    "closed": false,
    "end_date_iso": "2024-09-10",
    "game_start_time": null,
    "seconds_delay": 0,
    "minimum_order_size": "15",
    "minimum_tick_size": "0.01",
    "market_slug": "will-vivek-ramaswamy-win-the-us-2024-republican-presidential-nomination",
    "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/vivek+ramaswamy.png",
    "fpmm": "0x055e0D264A2f865c7D5c0A58A2229F66135530FD",
    "accepting_orders": true,
    "maker_base_fee": 0,
    "taker_base_fee": 0
}]

const orderBook = {
    bids: [
        {
            price: 0.5,
            size: 100
        },
        {
            price: 0.4,
            size: 100
        }
    ],
    asks: [
        {
            price: 0.6,
            size: 100
        },
        {
            price: 0.7,
            size: 100
        }
    ]
}

describe('PolymarketService', () => {
    let polymarketService: PolymarketService;
    beforeAll(async () => {
        //mock conifg service
        const configService = {
            get: (key: string) => {
                if (key === "privateKey") {
                    const wallet = ethers.Wallet.createRandom();
                    const privateKey = wallet.privateKey;
                    return privateKey;
                } else {
                    return "something else"
                }
            },
            getCreds: () => {
                return {
                    key: 'something',
                    secret: 'secret',
                    passphrase: 'passphrase'
                }
            }
        };
        const moduleRef = await Test.createTestingModule({
            providers: [PolymarketService, ConfigService],
        }).overrideProvider(ConfigService)
            .useValue(configService).compile();

        polymarketService = moduleRef.get<PolymarketService>(PolymarketService);
        jest.spyOn(polymarketService, 'getMarkets').mockImplementation(() => Promise.resolve(markets));
    });

    it('should only return markets accepting orders ', async () => {
        const marketsAcceptingOrders = await polymarketService.getMarketsAcceptingOrders();
        expect(marketsAcceptingOrders.length).toBe(1);
        expect(marketsAcceptingOrders[0].token_0.token_id).toBe("14811968980410449224099097755442778591369245152075435522945362809904270343154");
    });

    it('should taker fee equal to 200', async () => {
        const spy = jest.spyOn(polymarketService, 'getFeeRateBps').mockImplementation(() => Promise.resolve(200));
        const takerFee = await polymarketService.determineMakerOrTakerFee('14811968980410449224099097755442778591369245152075435522945362809904270343154', Side.BUY, 100, orderBook, 0.6);
        expect(spy).toHaveBeenCalledWith('14811968980410449224099097755442778591369245152075435522945362809904270343154', 'taker');
        expect(takerFee).toStrictEqual({ fee: 200, side: 'taker' });
    });

    it('should return maker fee equal to 0', async () => {
        const spy = jest.spyOn(polymarketService, 'getFeeRateBps').mockImplementation(() => Promise.resolve(0));
        const makerFee = await polymarketService.determineMakerOrTakerFee('14811968980410449224099097755442778591369245152075435522945362809904270343154', Side.SELL, 100, orderBook, 0.8);
        expect(spy).toHaveBeenCalledWith('14811968980410449224099097755442778591369245152075435522945362809904270343154', 'maker');
        expect(makerFee).toStrictEqual({ fee: 0, side: 'maker' });
    });

});