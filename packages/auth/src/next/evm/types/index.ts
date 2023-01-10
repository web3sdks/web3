import { Web3sdksSDK } from "@web3sdks/sdk";

export type Web3sdksAuthRoute = "login" | "logout" | "user";

export type Web3sdksAuthConfig = {
  privateKey: string;
  domain: string;
  callbacks?: {
    login?: (address: string) => Promise<void> | void;
    user?: (
      address: string,
    ) =>
      | Promise<Omit<Web3sdksAuthUser, "address">>
      | Omit<Web3sdksAuthUser, "address">;
  };
};

export type Web3sdksAuthContext = {
  sdk: Web3sdksSDK;
  domain: string;
  callbacks?: {
    login?: (address: string) => Promise<void> | void;
    user?: (
      address: string,
    ) =>
      | Promise<Omit<Web3sdksAuthUser, "address">>
      | Omit<Web3sdksAuthUser, "address">;
  };
};

export type Web3sdksAuthUser = {
  address: string;
  [key: string]: any;
};
