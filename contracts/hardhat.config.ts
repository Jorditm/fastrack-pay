import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-gas-reporter";

const WALLET_PRIVATE_KEY=process.env.WALLET_PRIVATE_KEY;
const ALCHEMY_SEPOLIA_URL=process.env.ALCHEMY_SEPOLIA_URL;

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
    }
  },
  defaultNetwork: "localhost"
};

export default config;
