import { createClient } from 'viem';
import { http, createConfig } from 'wagmi'
import { Chain, sepolia } from 'wagmi/chains'

export const chains: Chain[] = [sepolia];


export const config = createConfig({
  chains: [chains[0], ...chains.slice(1)],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})