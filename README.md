# fastrack-pay

This is our project for the ETHGlobal Brussels 2024 hackaton. FastrackPay is a solution that enables companies for a smooth experience for being paid using crypto.

We believe that to onboard the next billion users in crypto, we need to be able to onboard the next million of companies in crypto too, providing an experience that is as safe and known to them as possible (easy to integrate, as cheap as possible, avoiding volatility...), that's why we created a solution that intends to be an experience similar to PayPal: minimal (and easy) configuration for companies and safe and quick for users.

## Technologies

We use the following technologies to power our dapp: 

- Account abstraction: [Web3Auth](https://web3auth.io/)
- Gasless (sponsored) transactions: [Gelato Relay](https://www.gelato.network/relay)
- [Alchemy](https://www.alchemy.com/)
- Assets storage: [Lighthouse](https://www.lighthouse.storage/)
- 

## How does it work?

FastrackPay enables customers & companies to deploy our custom made smart wallets that are designed to provide a one-click payment or subscription experience through a hosted checkout page.

By logging into FastrackPay - using [Web3Auth](https://web3auth.io/) to enable for an account abstracted experience  -, users choose whether to create a customer or company account, which by calling a factory contract automatically deploys and links the smart wallet for them. Fees are sponsored by us via [Gelato Relay](https://www.gelato.network/relay) in order to make it easier for users and companies to onboard.

### For companies

When logged in, companies can create products (both single payment or subscriptions) that are stored on chain and used afterwards in order to generate the hosted checkout page where users can pay. They can also see their customers (including provided private information such as name and email, encrypted on chain and only available in plaintext through FastrackPay) and payments history. 

## Deployments

Our contract has been deployed in the following chains:

- Sepolia: [0x264B938d79B863493173C98Aa461a3486FFD3797](https://eth-sepolia.blockscout.com/address/0x264B938d79B863493173C98Aa461a3486FFD3797)
- Arbitrum: [0xe6212d3516B0040B3f4824641902458B7F1Cb8F9](https://sepolia-explorer.arbitrum.io/address/0xe6212d3516B0040B3f4824641902458B7F1Cb8F9)

### For users

The experience is similar to PayPal: our solution can be implemented by companies in their pages - e-commerce, SaaS, etc. -, users must create an account the first time and fund it (either with native or pre-approved ERC20 tokens) 
