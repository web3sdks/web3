import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { RequiredParam } from "../../core/query-utils/required-param";
import { ComponentWithChildren } from "../../core/types/component";
import {
  Web3sdksAuthConfig,
  Web3sdksAuthConfigProvider,
} from "../contexts/web3sdks-auth";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Network, Web3sdksSDK } from "@web3sdks/sdk/solana";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

interface Web3sdksSDKProviderProps extends QueryClientProviderProps {
  network: RequiredParam<Network>;
  wallet?: WalletContextState;
  authConfig?: Web3sdksAuthConfig;
}

/**
 * Gives access to the Web3sdksSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import { useWallet } from "@solana/wallet-adapter-react";
 * import { Web3sdksProvider } from "@web3sdks/react/solana";
 *
 * const Web3sdksApp = () => {
 *  const wallet = useWallet();
 *  return (
 *    <Web3sdksSDKProvider network={"devnet"} wallet={wallet}>
 *      <YourApp />
 *    </Web3sdksSDKProvider>
 * )};
 * ```
 */
export const Web3sdksSDKProvider: ComponentWithChildren<
  Web3sdksSDKProviderProps
> = ({ children, network, queryClient, wallet, authConfig }) => {
  const [sdk, setSDK] = useState<Web3sdksSDK | null>(null);

  useEffect(() => {
    if (network) {
      const _sdk = Web3sdksSDK.fromNetwork(network);
      if (wallet && wallet.publicKey) {
        _sdk.wallet.connect(wallet);
      }
      (_sdk as any)._network = network;
      setSDK(_sdk);
    } else {
      setSDK(null);
    }
    // disabled wallet on purpose because we handle that below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  useEffect(() => {
    if (
      wallet &&
      wallet.publicKey &&
      sdk &&
      (sdk as any)._network === network
    ) {
      sdk.wallet.connect(wallet);
      return;
    }
  }, [network, sdk, wallet]);

  const ctxValue = useMemo(
    () =>
      ({
        sdk,
        desiredNetwork: network || "unknown",
        _inProvider: true,
      } as const),
    [sdk, network],
  );

  return (
    <QueryClientProviderWithDefault queryClient={queryClient}>
      <Web3sdksAuthConfigProvider value={authConfig}>
        <Web3sdksSDKContext.Provider value={ctxValue}>
          {children}
        </Web3sdksSDKContext.Provider>
      </Web3sdksAuthConfigProvider>
    </QueryClientProviderWithDefault>
  );
};

interface Web3sdksSDKContext {
  sdk: Web3sdksSDK | null;
  desiredNetwork: string;
  _inProvider?: true;
}
const Web3sdksSDKContext = createContext<Web3sdksSDKContext>({
  sdk: null,
  desiredNetwork: "unknown",
});

export function useSDK() {
  const ctxValue = useContext(Web3sdksSDKContext);
  invariant(
    ctxValue._inProvider,
    "useSDK must be used within a Web3sdksSDKProvider",
  );
  if (
    !ctxValue.sdk ||
    (ctxValue.sdk as any)._network !== ctxValue.desiredNetwork
  ) {
    return null;
  }
  return ctxValue.sdk;
}
