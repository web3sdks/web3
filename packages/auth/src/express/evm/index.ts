import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import {
  Web3sdksAuthConfig,
  Web3sdksAuthRoute,
  Web3sdksAuthUser,
} from "./types";
import { Web3sdksSDK } from "@web3sdks/sdk";
import cookieParser from "cookie-parser";
import { Express, NextFunction, Request, Response } from "express";

export * from "./types";

export function getUser(req: Request): Web3sdksAuthUser | null {
  return req.user;
}

export function Web3sdksAuth(app: Express, cfg: Web3sdksAuthConfig) {
  const ctx = {
    ...cfg,
    sdk: Web3sdksSDK.fromPrivateKey(cfg.privateKey, "mainnet"),
  };

  const authUrl = cfg.authUrl?.replace(/\/$/, "") || "/auth";

  app.use(cookieParser());

  app.use(async (req: Request, _: Response, next: NextFunction) => {
    const { sdk, domain } = ctx;
    let user = null;
    const token = req.cookies.web3sdks_auth_token;

    if (token) {
      try {
        const address = await sdk.auth.authenticate(domain, token);

        if (ctx.callbacks?.user) {
          user = await ctx.callbacks.user(address);
        }

        user = { ...user, address };
      } catch {
        // No-op
      }
    }

    req.user = user as Web3sdksAuthUser | null;
    next();
  });

  app.get(`${authUrl}/:route`, (req: Request, res: Response) => {
    const action = req.params.route as Web3sdksAuthRoute;

    switch (action) {
      case "login":
        return loginHandler(req, res, ctx);
      case "user":
        return userHandler(req, res);
      case "logout":
        return logoutHandler(req, res);
      default:
        return res.status(400).json({
          message: "Invalid route for authentication.",
        });
    }
  });
}
