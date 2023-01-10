import { useWeb3sdksAuthConfig } from "../../contexts/web3sdks-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/**
 * Hook to logout the connected wallet from the backend.
 * The backend logout URL must be configured on the Web3sdksProvider.
 *
 * @returns - A function to invoke to logout.
 *
 * @beta
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const authConfig = useWeb3sdksAuthConfig();

  function logout() {
    invariant(
      authConfig,
      "Please specify an authConfig in the Web3sdksProvider",
    );
    queryClient.invalidateQueries(cacheKeys.auth.user());
    window.location.href = `${authConfig.authUrl}/logout`;
  }

  return logout;
}
