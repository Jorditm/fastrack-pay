require('dotenv').config()
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-gas-reporter";

const WALLET_PRIVATE_KEY=process.env.WALLET_PRIVATE_KEY;
const ALCHEMY_SEPOLIA_URL=process.env.ALCHEMY_SEPOLIA_URL;
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;
const ARBITRUM_SEPOLIA_URL=process.env.ARBITRUM_SEPOLIA_URL;
const POLYGON_ZKEVM_URL=process.env.POLYGON_ZKEVM_URL;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: ALCHEMY_SEPOLIA_URL!,
      accounts: [WALLET_PRIVATE_KEY!]
    },
    arbitrum: {
      url: ARBITRUM_SEPOLIA_URL!,
      accounts: [WALLET_PRIVATE_KEY!]
    },
    polygonZkEvm: {
      url: POLYGON_ZKEVM_URL!,
      accounts: [WALLET_PRIVATE_KEY!]
    }
  },
  defaultNetwork: "localhost",
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY!,
      arbitrum: ETHERSCAN_API_KEY!,
      polygonZkEvm: ETHERSCAN_API_KEY!
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://eth-sepolia.blockscout.com/api",
          browserURL: "https://eth-sepolia.blockscout.com/",
        }
      },
      {
        network: "arbitrum", 
        chainId: 421614,
        urls: {
          apiURL: "https://sepolia-explorer.arbitrum.io/api",
          browserURL: "https://sepolia-explorer.arbitrum.io/"
        }
      },
      {
        network: "polygonZkEvm",
        chainId: 2442,
        urls: {
          apiURL: "https://explorer-ui.cardona.zkevm-rpc.com/api",
          browserURL: "https://explorer-ui.cardona.zkevm-rpc.com/"
        }
      }
    ],
  },
  sourcify: {
    enabled: false
  }
};

export default config;
