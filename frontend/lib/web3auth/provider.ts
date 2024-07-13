import { Web3Auth } from "@web3auth/modal";
import { clientId, privateKeyProvider } from "./web3AuthProviderProps";
import { WEB3AUTH_NETWORK } from "@web3auth/base";

const web3auth = new Web3Auth({
    // Get it from Web3Auth Dashboard
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
  });

  export default web3auth;