NEAR-ETH token interoperability 
==================================

This project demonstrates a basic token swap: It allows you to mint 1 N-DAI on the NEAR blockchain, for every Dai deposited in a designated ethereum contract. In turn, upon burning these N-DAI, the DAI in the designated contract is released back to the sender(or to any ETH address of the burner's choice).

With very minor changes, this could be used to carry out a 1:1 swap of any ERC20 token on the ethereum blockchain to a corresponding N-Token. The user workflow in our design is as follows:

1. Deposit DAI to ETH address
2. NEAR contract detects deposited DAI and allows you to mint equivilant N-DAI
3. N-DAI tokens can be freely exchanged on NEAR Blockchain
4. N-DAI can be burnt by specifying a ETH address to return the DAI [NOTE: DAI RETURNS NON-FUNCTIONAL IN DEMO]

## Getting started

There are two ways to run this project. The first is the quick and a good way to instantly become familiar with this example.
Once familiar, the next step is for a developer to create their own NEAR account and deploy the contract to testnet. This is covered in the following section.

There's a button at the top of this file that says "Open in Gitpod." This will open the project in a new tab with an integrated development environment. The other option is to clone this repository and follow the same instructions.

### Quickest option

1. Install dependencies:

```
yarn
```

2. Build and deploy this smart contract to a development account. This development account will be created automatically and is not intended for reuse:

```
yarn dev
```

Your command line which will display a link to localhost similar to:
```bash
Server running at http://localhost:1234
```

Please open that link your browser to continue and see how to log in with NEAR Wallet in a simple webapp.

### Standard deploy option
In this second option, the smart contract will get deployed to a specific account created with the NEAR Wallet.

1. Ensure `near-shell` is installed by running:

```
near --version
```

If needed, install `near-shell`:

```
npm install near-shell -g
```

2. If you do not have a NEAR account, please create one with [NEAR Wallet](https://wallet.nearprotocol.com).

In the project root, login with `near-shell` by following the instructions after this command:

```
near login
```

3. Modify the top of `src/config.js`, changing the `CONTRACT_NAME` to be the NEAR account that was just used to log in.

```javascript
…
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'YOUR_ACCOUNT_NAME_HERE'; /* TODO: fill this in! */
…
```

4. Start the example!

```
yarn start
```

## To Test

```
yarn asp // as-pect tests
yarn jest // integration tests
yarn test // both
```

## To Explore

- `assembly/main.ts` for the contract code
- `src/index.html` for the front-end HTML
- `src/main.js` for the JavaScript front-end code and how to integrate contracts
- `src/test.js` for the JS tests for the contract
