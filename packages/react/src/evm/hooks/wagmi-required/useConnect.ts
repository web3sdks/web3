import invariant from "tiny-invariant";
import {
  useConnect as useWagmiConnect,
  useContext as useWagmiContext,
} from "wagmi";

/**
 * for now just re-exported
 * @internal
 */
export function useConnect() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useConnect() can only be used inside <Web3sdksProvider />. If you are using <Web3sdksSDKProvider /> you will have to use your own connection logic.`,
  );
  return useWagmiConnect();
}
