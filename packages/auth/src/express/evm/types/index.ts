import { Web3sdksSDK } from "@web3sdks/sdk";
import { Request } from "express";

export type Web3sdksAuthRoute = "login" | "user" | "logout";

export type Web3sdksAuthConfig = {
  privateKey: string;
  domain: string;
  authUrl?: string;
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

export type RequestWithUser = Request & {
  user: Web3sdksAuthUser | null;
};
