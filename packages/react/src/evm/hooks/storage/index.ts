import { useSDK } from "../../providers/base";

export * from "./useStorageUpload";

/**
 * Get the configured `Web3sdksStorage` instance
 * @returns The `storageInterface` configured on the `Web3sdksProvider`
 */
export function useStorage() {
  const sdk = useSDK();
  return sdk?.storage;
}
