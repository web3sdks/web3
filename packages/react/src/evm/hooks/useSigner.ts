import { useWeb3sdksConnectedWalletContext } from "../contexts/web3sdks-wallet";
import type { Signer } from "ethers";

/**
 *
 * @internal
 */
export function useSigner(): Signer | undefined {
  return useWeb3sdksConnectedWalletContext().signer;
}
