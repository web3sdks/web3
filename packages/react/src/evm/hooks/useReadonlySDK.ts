import { SDKOptions, Web3sdksSDK } from "@web3sdks/sdk";
import type { Web3sdksStorage } from "@web3sdks/storage";
import { useMemo } from "react";

/**
 * @internal
 */
export function useReadonlySDK(
  readonlyRpcUrl: string,
  sdkOptions: SDKOptions,
  storageInterface?: Web3sdksStorage,
): Web3sdksSDK {
  return useMemo(() => {
    return new Web3sdksSDK(
      readonlyRpcUrl,
      {
        ...sdkOptions,
        readonlySettings: {
          ...sdkOptions?.readonlySettings,
          rpcUrl: readonlyRpcUrl,
        },
      },
      storageInterface,
    );
    // storageInterface should be constant!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readonlyRpcUrl, sdkOptions]);
}
