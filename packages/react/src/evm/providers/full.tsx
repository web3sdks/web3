import type { GnosisSafeConnector } from "../connectors/gnosis-safe";
import type { MagicConnector } from "../connectors/magic";
import {
  Chain,
  SupportedChain,
  defaultSupportedChains,
} from "../constants/chain";
import { Web3sdksAuthConfig } from "../contexts/web3sdks-auth";
import { Web3sdksConfigProvider } from "../contexts/web3sdks-config";
import { Web3sdksSDKProvider, Web3sdksSDKProviderProps } from "./base";
import { QueryClient } from "@tanstack/react-query";
import {
  SDKOptions,
  getProviderForNetwork,
  SDKOptionsOutput,
} from "@web3sdks/sdk";
import { DEFAULT_RPC_URLS } from "@web3sdks/sdk";
import type { Web3sdksStorage } from "@web3sdks/storage";
import React, { useMemo } from "react";
import {
  WagmiProvider,
  ProviderProps as WagmiproviderProps,
  useProvider,
  useSigner,
  Connector,
} from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

/**
 * @internal
 */
export type InjectedConnectorType =
  | "injected"
  | "metamask"
  | { name: "injected" | "metamask"; options?: InjectedConnector["options"] };

/**
 * @internal
 */
export type WalletConnectConnectorType =
  | "walletConnect"
  | { name: "walletConnect"; options: WalletConnectConnector["options"] };

/**
 * @internal
 */
export type WalletLinkConnectorType =
  | "walletLink"
  | "coinbase"
  | {
      name: "walletLink" | "coinbase";
      options: CoinbaseWalletConnector["options"];
    };

/**
 * @internal
 */
export type WalletConnector =
  | InjectedConnectorType
  | WalletConnectConnectorType
  | WalletLinkConnectorType
  | GnosisSafeConnector
  | MagicConnector;

/**
 * @internal
 */
export type ChainRpc<TSupportedChain extends SupportedChain> = Record<
  TSupportedChain extends Chain ? TSupportedChain["id"] : TSupportedChain,
  string
>;
/**
 * the metadata to pass to wallet connection dialog (may show up during the wallet-connection process)
 * @remarks this is only used for wallet connect and wallet link, metamask does not support it
 * @public
 */
export interface DAppMetaData {
  /**
   * the name of your app
   */
  name: string;
  /**
   * optional - a description of your app
   */
  description?: string;
  /**
   * optional - a url that points to a logo (or favicon) of your app
   */
  logoUrl?: string;
  /**
   * optional - the url where your app is hosted
   */
  url?: string;
  /**
   * optional - whether to show the connect dialog in darkmode or not
   */
  isDarkMode?: boolean;
}

/**
 * The possible props for the Web3sdksProvider.
 */
export interface Web3sdksProviderProps<
  TSupportedChain extends SupportedChain = SupportedChain,
> {
  /**
   * The {@link SDKOptions | Web3sdks SDK Options} to pass to the web3sdks SDK
   * comes with sensible defaults
   */
  sdkOptions?: SDKOptions;
  /**
   * An array of chainIds or {@link Chain} objects that the dApp supports
   * If not provided, all chains supported by the SDK will be supported by default
   */
  supportedChains?: TSupportedChain[];
  /**
   * An array of connector types (strings) or wallet connector objects that the dApp supports
   * If not provided, will default to metamask (injected), wallet connect and walletlink (coinbase wallet) with sensible defaults
   */
  walletConnectors?: WalletConnector[];
  /**
   * A partial map of chainIds to rpc urls to use for certain chains
   * If not provided, will default to the rpcUrls of the chain objects for the supported chains
   */
  chainRpc?: Partial<ChainRpc<TSupportedChain>>;
  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `web3sdks powered dApp`.
   */
  dAppMeta?: DAppMetaData;
  /**
   * The chainId that your dApp is running on.
   * While this *can* be `undefined` it is required to be passed. Passing `undefined` will cause no SDK to be instantiated.
   * When passing a chainId, it **must** be part of the `supportedChains` array.
   */
  desiredChainId: TSupportedChain extends Chain
    ? TSupportedChain["id"]
    : TSupportedChain | undefined;

  /**
   * The configuration used for web3sdks auth usage. Enables users to login
   * to backends with their wallet.
   * @beta
   */
  authConfig?: Web3sdksAuthConfig;

  /**
   * The storage interface to use with the sdk.
   */
  storageInterface?: Web3sdksStorage;

  /**
   * The react-query client to use. (Defaults to a default client.)
   * @beta
   */
  queryClient?: QueryClient;

  /**
   * Whether or not to attempt auto-connect to a wallet.
   */
  autoConnect?: boolean;
}

// SDK handles this under the hood for us

const defaultdAppMeta: DAppMetaData = {
  name: "web3sdks powered dApp",
};

const defaultWalletConnectors: Required<
  Web3sdksProviderProps["walletConnectors"]
> = ["metamask", "walletConnect", "walletLink"];

/**
 *
 * The `<Web3sdksProvider />` component lets you control what networks you want users to connect to, what types of wallets can connect to your app, and the settings for the [Typescript SDK](https://docs.web3sdks.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * ```jsx title="App.jsx"
 * import { Web3sdksProvider, ChainId } from "@web3sdks/react";
 *
 * const App = () => {
 *   return (
 *     <Web3sdksProvider desiredChainId={ChainId.Mainnet}>
 *       <YourApp />
 *     </Web3sdksProvider>
 *   );
 * };
 * ```
 *
 * @public
 *
 */
export const Web3sdksProvider = <
  TSupportedChain extends SupportedChain = SupportedChain,
>({
  sdkOptions,
  chainRpc = DEFAULT_RPC_URLS,
  supportedChains = defaultSupportedChains.map(
    (c) => c.id,
  ) as TSupportedChain[],
  walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,
  desiredChainId,
  authConfig,
  storageInterface,
  queryClient,
  autoConnect = true,
  children,
}: React.PropsWithChildren<Web3sdksProviderProps<TSupportedChain>>) => {
  // construct the wagmi options

  const _supporrtedChains = useMemo(() => {
    return supportedChains
      .map((c) => {
        if (typeof c === "number") {
          return defaultSupportedChains.find((sc) => sc.id === c);
        }
        return c as Chain;
      })
      .filter((c) => c !== undefined) as Chain[];
  }, [supportedChains]);

  const _rpcUrlMap = useMemo(() => {
    return _supporrtedChains.reduce((prev, curr) => {
      prev[curr.id] =
        curr.id in chainRpc
          ? (getProviderForNetwork(
              chainRpc[curr.id as keyof ChainRpc<TSupportedChain>] ||
                curr.rpcUrls[0],
            ) as string)
          : curr.rpcUrls[0];
      return prev;
    }, {} as Record<number, string>);
  }, [chainRpc, _supporrtedChains]);

  const wagmiProps: WagmiproviderProps = useMemo(() => {
    const walletConnectClientMeta = {
      name: dAppMeta.name,
      url: dAppMeta.url || "",
      icons: [dAppMeta.logoUrl || ""],
      description: dAppMeta.description || "",
    };

    const walletLinkClientMeta = {
      appName: dAppMeta.name,
      appLogoUrl: dAppMeta.logoUrl,
      darkMode: dAppMeta.isDarkMode,
    };

    return {
      autoConnect,
      connectorStorageKey: "tw:provider:connectors",
      connectors: ({ chainId }: { chainId?: number }) => {
        return walletConnectors
          .map((connector) => {
            if (connector instanceof Connector) {
              return connector;
            }
            // injected connector
            if (
              (typeof connector === "string" &&
                (connector === "injected" || connector === "metamask")) ||
              (typeof connector === "object" &&
                (connector.name === "injected" ||
                  connector.name === "metamask"))
            ) {
              return new InjectedConnector({
                options:
                  typeof connector === "string"
                    ? { shimDisconnect: true, shimChainChangedDisconnect: true }
                    : connector.options,
                chains: _supporrtedChains,
              });
            }
            if (
              (typeof connector === "string" &&
                connector === "walletConnect") ||
              (typeof connector === "object" &&
                connector.name === "walletConnect")
            ) {
              return new WalletConnectConnector({
                options:
                  typeof connector === "string"
                    ? {
                        chainId,
                        rpc: _rpcUrlMap,
                        clientMeta: walletConnectClientMeta,
                        qrcode: true,
                      }
                    : {
                        chainId,
                        rpc: _rpcUrlMap,
                        clientMeta: walletConnectClientMeta,
                        qrcode: true,
                        ...connector.options,
                      },
                chains: _supporrtedChains,
              });
            }
            if (
              (typeof connector === "string" &&
                (connector === "coinbase" || connector === "walletLink")) ||
              (typeof connector === "object" &&
                (connector.name === "coinbase" ||
                  connector.name === "walletLink"))
            ) {
              const jsonRpcUrl = _rpcUrlMap[chainId || desiredChainId || 1];
              return new CoinbaseWalletConnector({
                chains: _supporrtedChains,
                options:
                  typeof connector === "string"
                    ? {
                        ...walletLinkClientMeta,
                        jsonRpcUrl,
                      }
                    : {
                        ...walletLinkClientMeta,
                        jsonRpcUrl,
                        ...connector.options,
                      },
              });
            }

            return null;
          })
          .filter((c) => c !== null);
      },
    } as WagmiproviderProps;
  }, [
    dAppMeta.name,
    dAppMeta.url,
    dAppMeta.logoUrl,
    dAppMeta.description,
    dAppMeta.isDarkMode,
    autoConnect,
    walletConnectors,
    _supporrtedChains,
    _rpcUrlMap,
    desiredChainId,
  ]);

  const readonlySettings: SDKOptionsOutput["readonlySettings"] = useMemo(() => {
    if (
      sdkOptions?.readonlySettings?.rpcUrl &&
      sdkOptions?.readonlySettings?.chainId
    ) {
      return sdkOptions.readonlySettings;
    }
    if (!desiredChainId) {
      return undefined;
    }
    let rpcUrl = _rpcUrlMap[desiredChainId as keyof typeof _rpcUrlMap];
    try {
      rpcUrl = getProviderForNetwork(rpcUrl) as string;
    } catch (e) {
      console.error(
        `failed to configure rpc url for chain: "${desiredChainId}". Did you forget to pass "desiredChainId" to the <Web3sdksProvider /> component?`,
      );
      // cannot set readonly without a valid rpc url
      return undefined;
    }
    return {
      chainId: desiredChainId,
      rpcUrl,
    };
  }, [_rpcUrlMap, desiredChainId, sdkOptions?.readonlySettings]);

  const sdkOptionsWithDefaults = useMemo(() => {
    const opts: SDKOptions = sdkOptions;
    return {
      ...opts,
      readonlySettings,
    };
  }, [sdkOptions, readonlySettings]);

  return (
    <Web3sdksConfigProvider
      value={{
        rpcUrlMap: _rpcUrlMap,
        supportedChains: _supporrtedChains,
      }}
    >
      <WagmiProvider {...wagmiProps}>
        <Web3sdksSDKProviderWagmiWrapper
          queryClient={queryClient}
          desiredChainId={desiredChainId}
          sdkOptions={sdkOptionsWithDefaults}
          storageInterface={storageInterface}
          authConfig={authConfig}
        >
          {children}
        </Web3sdksSDKProviderWagmiWrapper>
      </WagmiProvider>
    </Web3sdksConfigProvider>
  );
};

const Web3sdksSDKProviderWagmiWrapper: React.FC<
  React.PropsWithChildren<Omit<Web3sdksSDKProviderProps, "signer" | "provider">>
> = ({ children, ...props }) => {
  const provider = useProvider();
  const [signer] = useSigner();
  return (
    <Web3sdksSDKProvider signer={signer.data} provider={provider} {...props}>
      {children}
    </Web3sdksSDKProvider>
  );
};
