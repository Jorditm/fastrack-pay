import { Web3AuthContextConfig } from '@web3auth/modal-react-hooks'
import { Web3AuthOptions } from '@web3auth/modal'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin'

export const clientId =
  'BFtxK4txAeTLZhP4YtL2dLqfS2oq3IaTXtLbljuXiIziRPWtkopbkgEwzo9Odyel7u-WB3E2dFqmc8AoRs2G1N4'

 const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://eth-sepolia.g.alchemy.com/v2/F-tuWTTjOf3oo7e1PpXfnc8QTJKuT5n0",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
}

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
})
const web3AuthOptions: Web3AuthOptions = {
  clientId: clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: privateKeyProvider,
}

const openloginAdapter = new OpenloginAdapter()

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: { whiteLabel: { showWidgetButton: true } },
})

export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [openloginAdapter],
  plugins: [walletServicesPlugin],
}
