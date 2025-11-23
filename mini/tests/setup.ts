import type { VercelRequest, VercelResponse } from "@vercel/node";
import {IncomingMessage, ServerResponse} from "http";
import { createPublicClient, createWalletClient } from "viem";
import { hardhat } from "viem/chains";
import { http } from "@wagmi/core";
import { privateKeyToAccount } from "viem/accounts";

export type VercelHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<void>;

const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as `0x${string}`
);

const fromVercel = (handler: VercelHandler) => {
  return (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    const vercelReq = req as VercelRequest;
    vercelReq.query = Object.fromEntries(url.searchParams.entries());

    const vercelRes = res as VercelResponse;

    vercelRes.status = function (code: number): VercelResponse {
      res.statusCode = code;
      return this;
    };

    vercelRes.send = function (body: unknown): VercelResponse {
      if (typeof body === "object" && body !== null && !Buffer.isBuffer(body)) {
        if (!res.getHeader("Content-Type")) {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
        }
        res.end(JSON.stringify(body));
      } else {
        res.end(body);
      }
      return this;
    };

    vercelRes.json = function (body: unknown): VercelResponse {
      if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      res.end(JSON.stringify(body));
      return this;
    };

    Promise.resolve(handler(vercelReq, vercelRes)).catch(() => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
  };
};

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8546"),
});

const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http("http://127.0.0.1:8546"),
});

export { fromVercel, publicClient, walletClient }
