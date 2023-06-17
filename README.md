# pmarket-cli

Command line interface for Polymarket.

---

## Features

- List available markets with question filter.
- Buy tokens/shares.
- Sell tokens/shares.
- Set USDC allowance for CTFExchange contract.
- Show order book for specific token.
- Cancel all open orders.
- Generate api key for polymarket.

---

## Installation
Minimum required node version is 16.20.0
```shell
npm i pmarket-cli -g
```

---

## Setup

After successful installation you need to go through four steps in order
to place buy and sell orders with the tool. Setup requires editing config.json file
which is located under `~/.pmarket-cli/config.json` where `~` is your home directory.

1. You need to generate api key to access polygon network. I recommend using [infura.io](https://www.infura.io/) but you can use any other provider you like [Steps to generate key](https://docs.infura.io/getting-started).
   Once you generate the key set rpcProvider value in config.json file to your rpc provider url.
   Url should look something like this: `https://polygon-mainnet.infura.io/v3/your-api-key`

2. Generate your private key and set it in config.json file (privateKey entry). You can use [metamask](https://metamask.io/) to generate private key. [Steps to generate private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)

3. You will need to generate an api key for polymarket. You can do this by running the following command:

```shell
pmarket-cli -k
```

Take values from the response and set them in config.json file (apiKey, apiSecret and passphrase entries).

4. Set allowance for CTFExchange contract. You can do this by running the following command. This will allow CTFExchange contract to spend your USDC tokens.

```shell
pmarket-cli -a 500
```

After all 4 steps your config.json file should have all entries filled with values.

---

## Usage examples:

<details>
<summary>List available markets with question filter</summary>
Command

```shell
pmarket-cli -l "Will Trump attend the first RNC debate?"
```

Response

```shell
[
  {
    token_0: {
      token_id: '12110463059584809904811790486163860991533989713640269122405796144537637099628',
      outcome: 'Yes'
    },
    token_1: {
      token_id: '29339358161683554702930216891507179890535004654000050338417989709558351328832',
      outcome: 'No'
    },
    question: 'Will Trump attend the first RNC debate?'
  }
]
```

</details>

<details>
<summary>Buy token order</summary>
Command

```shell
pmarket-cli -b 12110463059584809904811790486163860991533989713640269122405796144537637099628 30 0.5
```

Response

```shell
  {
    "success": true,
    "errorMsg": "",
    "orderID": "0x556d3864c64d851462b2f378f5e6dcec7d31ba1632dfe44bfdcaa3cc685b45cc",
    "transactionsHashes": [
      "0x23d3b0f75446128bff33fd750870a1ea03a210de863ed7efd836ab3d18d83609"
    ],
    "status": "matched"
  }
```

</details>

<details>
<summary>Sell token order</summary>
Command

```shell
pmarket-cli -s 12110463059584809904811790486163860991533989713640269122405796144537637099628 30 0.5
```

Response

```shell
  {
    "success": true,
    "errorMsg": "",
    "orderID": "0x556d3864c64d851462b2f378f5e6dcec7d31ba1632dfe44bfdcaa3cc685b45cc",
    "transactionsHashes": [
      "0x23d3b0f75446128bff33fd750870a1ea03a210de863ed7efd836ab3d18d83609"
    ],
    "status": "matched"
  }
```

</details>

<details>
<summary>Set USDC allowance for CTFExchange contract</summary>
Command

```shell
pmarket-cli -a 500
```

Response

```shell
Block Gas Limit: 30323827
{
  type: 2,
  chainId: 137,
  nonce: 164,
  maxPriorityFeePerGas: BigNumber { _hex: '0xabcd', _isBigNumber: true },
  maxFeePerGas: BigNumber { _hex: '0xabcd', _isBigNumber: true },
  gasPrice: null,
  gasLimit: BigNumber { _hex: '0xabcd', _isBigNumber: true },
  to: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  value: BigNumber { _hex: '0x00', _isBigNumber: true },
  data: '0x000ea7b30000000000000000000000004bfb41d5b3570defd03c39a9a4d8de6bd8b8982e00000000000000000000000000000000000000000000000000000000300aca00',
  accessList: [],
  hash: '0x6d409ef667f20807599ff2c1495df8f1ab71b7810a83e001a20196e43f469299',
  v: 0,
  r: '0xe9afafb7a4e036f4d1b06945afb5a08b8e0eb368daa5efa3b800c443e4f4113a',
  s: '0x084689146316314ad56868d3161438b31ed04a748fc008a5ac2c93f1f778779f',
  from: '0x01819b106DBfFD451bbE00ED1e3CE2fBD13CC947',
  confirmations: 0,
  wait: [Function (anonymous)]
}
```

</details>

<details>
<summary>Show order book for specific tokenId</summary>
Command

```shell
pmarket-cli -o 12110463059584809904811790486163860991533989713640269122405796144537637099628
```

Response

```shell
{
  market: '0x6f662d9d965d0b01d08ee284a58e1dd866296729801c0cdc6867459760bd33ab',
  asset_id: '12110463059584809904811790486163860991533989713640269122405796144537637099628',
  bids: [
    { price: '0.03', size: '100' },
    { price: '0.45', size: '200' },
    { price: '0.51', size: '2000' },
    { price: '0.55', size: '200' }
  ],
  asks: [
    { price: '0.99', size: '1000' },
    { price: '0.97', size: '100' },
    { price: '0.95', size: '200' },
    { price: '0.9', size: '200' },
    { price: '0.75', size: '200' },
    { price: '0.72', size: '19' },
    { price: '0.7', size: '15' },
    { price: '0.69', size: '1022.76' },
    { price: '0.68', size: '191.52' }
  ],
  hash: '6993a77070f72dccda117544c72eb1ca4cef4bf7'
}
```

</details>

<details>
<summary>Get or generate api keys</summary>
Command

```shell
pmarket-cli -k
```

Response

```shell
{
  apiKey: 'your-api-key',
  secret: 'your-api-key-secret',
  passphrase: 'your-api-key-passphrase'
}
```

</details>

<details>
<summary>Cancel all open orders</summary>
Command

```shell
pmarket-cli -c
```

Response

```shell
{ canceled: [], not_canceled: {} }
```

</details>

---

## Issues

Please use the [Issue Tracker](https://github.com/arekgotfryd/pmarket-cli/issues) to report any issues or bugs.

---

## License

This project is licensed under the [MIT License](https://github.com/arekgotfryd/pmarket-cli/blob/master/LICENSE).
