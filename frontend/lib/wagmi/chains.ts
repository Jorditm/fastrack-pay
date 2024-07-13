import { defineChain } from 'viem'

export const localhost = defineChain({
    id: 1,
    name: 'localhost',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['http://127.0.0.1:8545'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
    contracts: {
    }
  })