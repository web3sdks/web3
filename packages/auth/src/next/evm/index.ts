import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import {
  Web3sdksAuthConfig,
  Web3sdksAuthContext,
  Web3sdksAuthRoute,
  Web3sdksAuthUser,
} from "./types";
import { Web3sdksSDK } from "@web3sdks/sdk";
import { NextRequest } from "next/server";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";

export * from "./types";

async function Web3sdksAuthRouter(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: Web3sdksAuthContext,
) {
  // Catch-all route must be named with [...web3sdks]
  const { web3sdks } = req.query;
  const action = web3sdks?.[0] as Web3sdksAuthRoute;

  switch (action) {
    case "login":
      return await loginHandler(req, res, ctx);
    case "user":
      return await userHandler(req, res, ctx);
    case "logout":
      return await logoutHandler(req, res);
    default:
      return res.status(400).json({
        message: "Invalid route for authentication.",
      });
  }
}

export function Web3sdksAuth(cfg: Web3sdksAuthConfig) {
  const ctx = {
    ...cfg,
    sdk: Web3sdksSDK.fromPrivateKey(cfg.privateKey, "mainnet"),
  };

  function Web3sdksAuthHandler(
    ...args: [] | [NextApiRequest, NextApiResponse]
  ) {
    if (args.length === 0) {
      return async (req: NextApiRequest, res: NextApiResponse) =>
        await Web3sdksAuthRouter(req, res, ctx);
    }

    return Web3sdksAuthRouter(args[0], args[1], ctx);
  }

  async function getUser(
    req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ) {
    const { sdk, domain } = ctx;
    let user: Web3sdksAuthUser | null = null;
    const token =
      typeof req.cookies.get === "function"
        ? (req.cookies as any).get("web3sdks_auth_token")
        : (req.cookies as any).web3sdks_auth_token;

    if (token) {
      try {
        const address = await sdk.auth.authenticate(domain, token);

        let data = {};
        if (ctx.callbacks?.user) {
          data = await ctx.callbacks.user(address);
        }

        user = { ...data, address };
      } catch {
        // No-op
      }
    }

    return user;
  }

  return { Web3sdksAuthHandler, getUser };
}
