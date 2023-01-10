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
import {
  Web3sdksConnectedWalletProvider,
  useWeb3sdksConnectedWalletContext,
} from "../contexts/web3sdks-wallet";
import {
  ChainOrRpc,
  SDKOptions,
  SignerOrProvider,
  SUPPORTED_CHAIN_ID,
  Web3sdksSDK,
} from "@web3sdks/sdk";
import { Web3sdksStorage } from "@web3sdks/storage";
import { Signer } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: Web3sdksSDK;
  _inProvider?: true;
  desiredChainId: number;
}

const Web3sdksSDKContext = createContext<TWSDKContext>({ desiredChainId: -1 });

export interface Web3sdksSDKProviderProps extends QueryClientProviderProps {
  desiredChainId: RequiredParam<SUPPORTED_CHAIN_ID>;
  provider: ChainOrRpc | SignerOrProvider;

  signer?: Signer;

  sdkOptions?: SDKOptions;
  storageInterface?: Web3sdksStorage;
  authConfig?: Web3sdksAuthConfig;
}

/**
 *
 * @internal
 */
export const WrappedWeb3sdksSDKProvider: ComponentWithChildren<
  Omit<Web3sdksSDKProviderProps, "signer">
> = ({
  sdkOptions,
  desiredChainId,
  storageInterface,
  provider,
  queryClient,
  authConfig,
  children,
}) => {
  const { signer } = useWeb3sdksConnectedWalletContext();

  const [sdk, setSDK] = useState<Web3sdksSDK>();

  useEffect(() => {
    if (!desiredChainId || typeof window === "undefined") {
      return undefined;
    }

    const _sdk = new Web3sdksSDK(provider, sdkOptions, storageInterface);
    // if we already have a signer from the wallet context, use it immediately
    if (signer) {
      _sdk.updateSignerOrProvider(signer);
    }

    (_sdk as any)._constructedAt = Date.now();
    (_sdk as any)._chainId = desiredChainId;
    setSDK(_sdk);

    // explicitly *not* passing the signer, if we have it we use it if we don't we don't
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, sdkOptions, storageInterface, desiredChainId]);

  useEffect(() => {
    if (sdk && (sdk as any)._chainId === desiredChainId) {
      if (signer) {
        sdk.updateSignerOrProvider(signer);
      } else {
        sdk.updateSignerOrProvider(provider);
      }
    }
  }, [signer, sdk, desiredChainId, provider]);

  const ctxValue = useMemo(
    () => ({
      sdk,
      desiredChainId: desiredChainId || -1,
      _inProvider: true as const,
    }),
    [desiredChainId, sdk],
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

/**
 * A basic wrapper around the Web3sdks SDK.
 *
 * You can use this in order to be able to pass a provider & signer directly to the SDK.
 *
 * @remarks Utilizing this provider will mean hooks for wallet management are not available, if you need those please use the {@link Web3sdksProvider} instead.
 *
 * @public
 */
export const Web3sdksSDKProvider: ComponentWithChildren<
  Web3sdksSDKProviderProps
> = ({ signer, children, ...restProps }) => {
  return (
    <Web3sdksConnectedWalletProvider signer={signer}>
      <WrappedWeb3sdksSDKProvider {...restProps}>
        {children}
      </WrappedWeb3sdksSDKProvider>
    </Web3sdksConnectedWalletProvider>
  );
};

/**
 * @internal
 */
function useSDKContext(): TWSDKContext {
  const ctx = useContext(Web3sdksSDKContext);
  invariant(
    ctx._inProvider,
    "useSDK must be called from within a Web3sdksProvider, did you forget to wrap your app in a <Web3sdksProvider />?",
  );
  return ctx;
}

/**
 *
 * @returns {@link Web3sdksSDK}
 * Access the instance of the web3sdks SDK created by the Web3sdksProvider
 * to call methods using the connected wallet on the desiredChainId.
 * @example
 * ```javascript
 * const sdk = useSDK();
 * ```
 */
export function useSDK(): Web3sdksSDK | undefined {
  const { sdk } = useSDKContext();
  return sdk;
}

/**
 * @internal
 */
export function useDesiredChainId(): number {
  const { desiredChainId } = useSDKContext();
  return desiredChainId;
}

/**
 * @internal
 */
export function useSDKChainId(): SUPPORTED_CHAIN_ID | undefined {
  const sdk = useSDK();
  return (sdk as any)?._chainId;
}
