import { Web3sdksAuthConfig } from "../contexts/web3sdks-auth";
import { Web3sdksSDKProvider } from "./base";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { getUrlForNetwork, Network } from "@web3sdks/sdk/solana";
import { PropsWithChildren } from "react";

interface Web3sdksProviderProps {
  network: Network;
  wallets?: WalletAdapter[];
  autoConnect?: boolean;
  authConfig?: Web3sdksAuthConfig;
}

const DEFAULT_WALLETS = [new PhantomWalletAdapter()];

/**
 * Gives access to the Web3sdksSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import { Web3sdksProvider } from "@web3sdks/react/solana";
 *
 * const App = () => {
 *  return (
 *     <Web3sdksProvider network="devnet">
 *       <YourApp />
 *     </Web3sdksProvider>
 * )};
 * ```
 * @beta
 */
export const Web3sdksProvider: React.FC<
  PropsWithChildren<Web3sdksProviderProps>
> = ({
  network,
  wallets = DEFAULT_WALLETS,
  autoConnect = true,
  authConfig,
  children,
}) => {
  const clusterUrl = getUrlForNetwork(network);
  return (
    <ConnectionProvider endpoint={clusterUrl}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <Web3sdksWrapperProvider network={network} authConfig={authConfig}>
          {children}
        </Web3sdksWrapperProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * @internal
 */
export const Web3sdksWrapperProvider: React.FC<
  PropsWithChildren<{ network?: Network; authConfig?: Web3sdksAuthConfig }>
> = ({ network, authConfig, children }) => {
  const wallet = useWallet();
  return (
    <Web3sdksSDKProvider
      network={network}
      wallet={wallet}
      authConfig={authConfig}
    >
      {children}
    </Web3sdksSDKProvider>
  );
};
