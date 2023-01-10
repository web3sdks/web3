import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

/**
 * The configuration to use the react SDK with an [auth](https://docs.web3sdks.com/auth) server.
 *
 * @beta
 */
export interface Web3sdksAuthConfig {
  /**
   * The backend URL of the authentication endoints. For example, if your endpoints are
   * at `/api/auth/login`, `/api/auth/logout`, etc. then this should be set to `/api/auth`.
   */
  authUrl: string;

  /**
   * The frontend domain used to generate the login payload.
   * This domain should match the domain used on your auth backend.
   */
  domain: string;

  /**
   * The URL to redirect to after a succesful login.
   */
  loginRedirect?: string;
}

const Web3sdksAuthConfigContext = createContext<Web3sdksAuthConfig | undefined>(
  undefined,
);

export const Web3sdksAuthConfigProvider: React.FC<
  PropsWithChildren<{ value?: Web3sdksAuthConfig }>
> = ({ value, children }) => {
  // Remove trailing slash from URL if present
  const authConfig = useMemo(
    () =>
      value
        ? {
            ...value,
            authUrl: value.authUrl.replace(/\/$/, ""),
          }
        : undefined,
    [value],
  );
  return (
    <Web3sdksAuthConfigContext.Provider value={authConfig}>
      {children}
    </Web3sdksAuthConfigContext.Provider>
  );
};

export function useWeb3sdksAuthConfig() {
  return useContext(Web3sdksAuthConfigContext);
}
