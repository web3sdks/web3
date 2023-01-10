import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useWeb3sdksAuthConfig } from "../../contexts/web3sdks-auth";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

export interface Web3sdksAuthUser {
  address: string;
}

/**
 * Hook to get the currently logged in user.
 *
 * @returns - The currently logged in user or null if not logged in, as well as a loading state.
 *
 * @beta
 */
export function useUser() {
  const authConfig = useWeb3sdksAuthConfig();

  const { data: user, isLoading } = useQuery(
    ensureTWPrefix(["user"]),
    async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the Web3sdksProvider",
      );
      const res = await fetch(`${authConfig.authUrl}/user`, {
        credentials: "include",
      });
      return (await res.json()) as Web3sdksAuthUser;
    },
    {
      enabled: !!authConfig,
    },
  );

  return { user, isLoading };
}
