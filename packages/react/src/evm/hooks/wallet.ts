import { useWeb3sdksConnectedWalletContext } from "../contexts/web3sdks-wallet";
import { ContractAddress } from "../types";
import { cacheKeys } from "../utils/cache-keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * A hook to get the native or (optional) ERC20 token balance of the connected wallet.
 *
 * @param tokenAddress - the address of the token contract, if empty will use the chain's native token
 * @returns the balance of the connected wallet (native or ERC20)
 * @beta
 */
export function useBalance(tokenAddress?: ContractAddress) {
  const walletAddress = useAddress();

  const { wallet, address, chainId } = useWeb3sdksConnectedWalletContext();

  const cacheKey = useMemo(() => {
    return cacheKeys.wallet.balance(chainId || -1, address, tokenAddress);
  }, [chainId, tokenAddress, address]);

  return useQuery(
    cacheKey,
    () => {
      return wallet?.balance(tokenAddress);
    },
    {
      // if user is not logged in no reason to try to fetch
      enabled: !!wallet && !!walletAddress && !!chainId,
      retry: true,
      keepPreviousData: false,
    },
  );
}

/**
 * @internal
 */
export function useConnectedWallet() {
  return useWeb3sdksConnectedWalletContext().wallet;
}

/**
 * Hook for accessing the address of the connected wallet
 *
 * ```javascript
 * import { useAddress } from "@web3sdks/react"
 * ```
 *
 *
 * @example
 * To get the address of the connected wallet, you can use the hook as follows:
 *
 * ```javascript
 * import { useAddress } from "@web3sdks/react"
 *
 * const App = () => {
 *   const address = useAddress()
 *
 *   return <div>{address}</div>
 * }
 * ```
 *
 * The `address` variable will hold the address of the connected wallet if a user has connected using one of the supported wallet connection hooks.
 *
 * @public
 */
export function useAddress(): string | undefined {
  return useWeb3sdksConnectedWalletContext().address;
}

/**
 * Hook for accessing the chain ID of the network the current wallet is connected to
 *
 * ```javascript
 * import { useChainId } from "@web3sdks/react"
 * ```
 *
 * @example
 * You can get the chain ID of the connected wallet by using the hook as follows:
 * ```javascript
 * import { useChainId } from "@web3sdks/react"
 *
 * const App = () => {
 *   const chainId = useChainId()
 *
 *   return <div>{chainId}</div>
 * }
 * ```
 * @public
 */
export function useChainId(): number | undefined {
  return useWeb3sdksConnectedWalletContext().chainId;
}
