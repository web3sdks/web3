import { Web3sdksAuthContext, Web3sdksAuthUser } from "../types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: Web3sdksAuthContext,
) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

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

  return res.status(200).json(user as Web3sdksAuthUser | null);
}
