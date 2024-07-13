import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { localhost } from './chains'

export const config = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http(),
    [sepolia.id]: http(),
  },
})