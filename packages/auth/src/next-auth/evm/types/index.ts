import { NextAuthOptions } from "next-auth";

export type Web3sdksNextAuthConfig = {
  privateKey: string;
  domain: string;
  nextOptions: NextAuthOptions;
};
