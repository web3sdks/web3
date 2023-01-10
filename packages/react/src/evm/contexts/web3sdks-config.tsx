import {
  Chain,
  SupportedChainId,
  defaultSupportedChains,
} from "../constants/chain";
import { DEFAULT_RPC_URLS } from "@web3sdks/sdk";
import React, { PropsWithChildren, createContext, useContext } from "react";

interface Web3sdksConfigContext {
  rpcUrlMap: Record<SupportedChainId | number, string>;
  supportedChains: Chain[];
}

const Web3sdksConfigContext = createContext<Web3sdksConfigContext>({
  rpcUrlMap: DEFAULT_RPC_URLS,
  supportedChains: defaultSupportedChains,
});

export const Web3sdksConfigProvider: React.FC<
  PropsWithChildren<{
    value: Web3sdksConfigContext;
  }>
> = ({ value, children }) => (
  <Web3sdksConfigContext.Provider value={value}>
    {children}
  </Web3sdksConfigContext.Provider>
);

export function useWeb3sdksConfigContext() {
  return useContext(Web3sdksConfigContext);
}
