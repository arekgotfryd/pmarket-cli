# pmarket-cli
[![npm version](https://img.shields.io/npm/v/pmarket-cli)](https://www.npmjs.com/package/pmarket-cli)
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

After successful installation you need to go through couple of steps in order
to place buy and sell orders with the tool. Setup requires editing config.json file
which is located under `~/.pmarket-cli/config.json` where `~` is your home directory.

1. You need to generate api key to access polygon network. I recommend using [infura.io](https://www.infura.io/) but you can use any other provider you like [Steps to generate key](https://docs.infura.io/getting-started).
   Once you generate the key set `rpcProvider` value in config.json file to your rpc provider url.
   Url should look something like this: `https://polygon-mainnet.infura.io/v3/your-api-key`

2. Generate your metamask wallet private key and set it in config.json file (`privateKey` entry). [Steps to generate private key](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key)

3. Get your `funderAddress` from polymarket app (The one next to your public profile on polymarket app)

4. You will need to generate an api key for polymarket. You can do this by running the following command:

```shell
pmarket-cli -k
```

Take values from the response and set them in config.json file (`apiKey`, `apiSecret` and `passphrase` entries).

5. Set allowance for CTFExchange contract. You can do this by running the following command. This will allow CTFExchange contract to spend your USDC tokens.

```shell
pmarket-cli -a 500
```

After all 5 steps your config.json file should have all entries filled with values.
```
{
    "apiKey": "apiKey",(step 4)
    "apiSecret": "apiSecret",(step 4)
    "passphrase": "passphrase",(step 4)
    "rpcProvider": "https://polygon-mainnet.infura.io/v3/your-api-key", (step 1)
    "privateKey": "your-metamask-wallet-private-key",(step 2)
    "funderAddress": "funderAddressFromPolymarketApp" (step 3)
}
```

---

## Usage examples:

<details>
<summary>List available markets with question filter</summary>
Command

```shell
pmarket-cli -l "Oscar"
```

Response

```shell
[
  {
    yes: {
      token_id: '32690616433410387308307813339600971589831744601462134742731346664328487681674',
      outcome: 'Yes',
      price: 0.645,
      winner: false
    },
    no: {
      token_id: '93520364131545158991271066783085167796254018656458248205265557269588037162187',
      outcome: 'No',
      price: 0.355,
      winner: false
    },
    question: "Will 'Sing Sing' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '100401097213549719544430330089381355980751133453267218243446808652190404553676',
      outcome: 'Yes',
      price: 0.625,
      winner: false
    },
    no: {
      token_id: '5399213552646241399758526346963923893707773966118900537360111893113091092777',
      outcome: 'No',
      price: 0.375,
      winner: false
    },
    question: "Will 'A Real Pain' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '96640869691532587244570283302780466327078472971610770069097941773703286390027',
      outcome: 'Yes',
      price: 0.981,
      winner: false
    },
    no: {
      token_id: '67931077130043942518483022378076251176956266677865613007855881895832314338989',
      outcome: 'No',
      price: 0.019,
      winner: false
    },
    question: "Will 'Emilia Perez' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '71253205524417391866208339119597974189550792786476743396831705495855112450492',
      outcome: 'Yes',
      price: 0.315,
      winner: false
    },
    no: {
      token_id: '16882157695214605799133873002564430339850918902933529749045793413918741191752',
      outcome: 'No',
      price: 0.685,
      winner: false
    },
    question: "Will 'September 5' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '111738901907809443600037910023684478622915124934957230261829398758881989293766',
      outcome: 'Yes',
      price: 0.09,
      winner: false
    },
    no: {
      token_id: '33976536607797914371585069047396561557527874165898480435138330747945477786512',
      outcome: 'No',
      price: 0.91,
      winner: false
    },
    question: "Will 'Blitz' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '17141600067691573577485747775118635864925506414161610505761549736848495519363',
      outcome: 'Yes',
      price: 0.545,
      winner: false
    },
    no: {
      token_id: '101962157253245690493877071168263866510465623662446987356042737166417606798256',
      outcome: 'No',
      price: 0.455,
      winner: false
    },
    question: "Will 'A Complete Unknown' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '90992535272147567931508137629092419903145779789552007385817623243259081817819',
      outcome: 'Yes',
      price: 0.625,
      winner: false
    },
    no: {
      token_id: '112050965724963176646680630632767812634280014319419640668361967417736052131131',
      outcome: 'No',
      price: 0.375,
      winner: false
    },
    question: "Will 'The Substance' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '11401947330912495336075989162259552620335030712684952206022571276421308445194',
      outcome: 'Yes',
      price: 0.575,
      winner: false
    },
    no: {
      token_id: '71405501953515250392036436688816920605059194883228676237741391871754267694223',
      outcome: 'No',
      price: 0.425,
      winner: false
    },
    question: "Will 'Nickel Boys' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '104687854183071741371695044459492858385023155729056052792472869008359784070851',
      outcome: 'Yes',
      price: 0.155,
      winner: false
    },
    no: {
      token_id: '95256566383480312433988451491253310710707233915223521570088402500343648576289',
      outcome: 'No',
      price: 0.845,
      winner: false
    },
    question: "Will 'The Seed of the Sacred Fig' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '106124606603253014598710528659186278479494442996460010129243257316537903936557',
      outcome: 'Yes',
      price: 0.095,
      winner: false
    },
    no: {
      token_id: '42392241498764529227049798458044618986039872101558312093943861400630136579252',
      outcome: 'No',
      price: 0.905,
      winner: false
    },
    question: "Will 'Challengers' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '70107851796254851256550131323680162861915303716570160476164262541864168848203',
      outcome: 'Yes',
      price: 0.175,
      winner: false
    },
    no: {
      token_id: '91129262031415306337846861683941945267499438177680407919369102453214763879537',
      outcome: 'No',
      price: 0.825,
      winner: false
    },
    question: "Will 'Nosferatu' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '24407508819234282464933075570576262820711040241472859810696604181515136132297',
      outcome: 'Yes',
      price: 0.12,
      winner: false
    },
    no: {
      token_id: '20077393403763790363624979235978091595345440602923095023242303408941046675470',
      outcome: 'No',
      price: 0.88,
      winner: false
    },
    question: "Will 'The Piano Lesson' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '99736097289508014861057174585239840739129795025185531876280544252158499243638',
      outcome: 'Yes',
      price: 0.06,
      winner: false
    },
    no: {
      token_id: '1880131924389797790288814877967953731284212787573623296031594534223744445027',
      outcome: 'No',
      price: 0.94,
      winner: false
    },
    question: "Will 'A Different Man' be nominated for Oscar for Best Picture?"
  },
  {
    yes: {
      token_id: '41194420579853832111792943550797230648479286191062857764566839803695954154898',
      outcome: 'Yes',
      price: 0.165,
      winner: false
    },
    no: {
      token_id: '6980419307993749449373106703104366839484022772040366571203245278705517294617',
      outcome: 'No',
      price: 0.835,
      winner: false
    },
    question: "Will 'Gladiator 2' be nominated for Oscar for Best Picture?"
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
  market: '0xe986284ed884732cb82713c2ff601056f092efe785254fa16a4db0abc7e76654',
  asset_id: '80686157984042045124111759746605774670542171586147533847217628946080812697410',
  timestamp: '1734286970575',
  hash: 'bcc5d198def20dcd6d77ac297d362d018afff96b',
  bids: [
    { price: '0.014', size: '410.5' },
    { price: '0.015', size: '416.5' },
    { price: '0.022', size: '280' },
    { price: '0.035', size: '300' },
    { price: '0.036', size: '71.57' },
    { price: '0.044', size: '2853.41' },
    { price: '0.051', size: '591.94' },
    { price: '0.058', size: '30' },
    { price: '0.062', size: '85.47' },
    { price: '0.063', size: '146' }
  ],
  asks: [
    { price: '0.998', size: '8000' },
    { price: '0.987', size: '1500' },
    { price: '0.975', size: '600' },
    { price: '0.97', size: '388' },
    { price: '0.949', size: '300' },
    { price: '0.94', size: '250' },
    { price: '0.93', size: '200' },
    { price: '0.89', size: '125' },
    { price: '0.88', size: '200.44' },
    { price: '0.875', size: '125' },
    { price: '0.87', size: '125' },
    { price: '0.85', size: '100' },
    { price: '0.849', size: '1986' },
    { price: '0.82', size: '120' },
    { price: '0.81', size: '100' },
    { price: '0.8', size: '250' },
    { price: '0.79', size: '254' },
    { price: '0.77', size: '250' },
    { price: '0.76', size: '100' },
    { price: '0.75', size: '100' },
    { price: '0.73', size: '67.25' },
    { price: '0.72', size: '100' },
    { price: '0.7', size: '250.27' },
    { price: '0.69', size: '250.07' },
    { price: '0.68', size: '75' },
    { price: '0.67', size: '100' },
    { price: '0.65', size: '60' },
    { price: '0.64', size: '100' },
    { price: '0.62', size: '147' },
    { price: '0.6', size: '120' },
    { price: '0.59', size: '117.91' },
    { price: '0.58', size: '75' },
    { price: '0.57', size: '192.7' },
    { price: '0.56', size: '250.01' },
    { price: '0.55', size: '50' },
    { price: '0.49', size: '215' },
    { price: '0.48', size: '65' },
    { price: '0.47', size: '107.29' },
    { price: '0.44', size: '45' },
    { price: '0.164', size: '20' },
    { price: '0.115', size: '23' },
    { price: '0.106', size: '91.65' },
    { price: '0.072', size: '210' },
    { price: '0.071', size: '128.2' },
    { price: '0.07', size: '31.47' }
  ]
}
BUY
Amount of shares/tokens: 15
Price0.064
{
  salt: '881519783809',
  maker: '0x74e0D67f659766360E92152ea8c8a935BA89FAbD',
  signer: '0x72819b106DBfFD451bbE40ED1e3CE2fBD13CC947',
  taker: '0x0000000000000000000000000000000000000000',
  tokenId: '80686157984042045124111759746605774670542171586147533847217628946080812697410',
  makerAmount: '960000',
  takerAmount: '15000000',
  expiration: '0',
  nonce: '0',
  feeRateBps: '0',
  side: 0,
  signatureType: 2,
  signature: '0x4ce2e19f68887725a289be82fc2879dd0e346e1f1d11a8d63579d5ddf236767a08a3f3a0d0da9c831ff98eb0e9e9aaaddbd20f75c4a7e8d7c09dfc9b2eed459c1c'
}
{
  errorMsg: '',
  orderID: '0x6f89228a046c2cda1beb604599bda10c6acab735e2d8fdd7208754575f88dae0',
  takingAmount: '',
  makingAmount: '',
  status: 'live',
  transactionsHashes: null,
  success: true
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
