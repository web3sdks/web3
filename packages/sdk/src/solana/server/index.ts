import { Web3sdksSDK } from "../sdk";
import { Network } from "../types/index";
import { getPayer } from "./local-config";
import { KeypairSigner } from "@metaplex-foundation/js";
import { Web3sdksStorage } from "@web3sdks/storage";

/**
 * Create an SDK instance using the local configuration generated by the Solana CLI
 *
 * @example
 * ```jsx
 * import { createWeb3sdksSDK } from "@web3sdks/sdk/solana";
 *
 * // Select the network to create the SDK on
 * const sdk = createWeb3sdksSDK("devnet");
 * ```
 *
 * @public
 */
export function createWeb3sdksSDK(
  network: Network,
  storage: Web3sdksStorage = new Web3sdksStorage(),
): Web3sdksSDK {
  const payer = getPayer();
  const signer: KeypairSigner = {
    publicKey: payer.publicKey,
    secretKey: payer.secretKey,
  };
  const sdk = Web3sdksSDK.fromNetwork(network, storage);
  sdk.wallet.connect(signer);
  return sdk;
}