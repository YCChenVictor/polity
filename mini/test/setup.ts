import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as http from "http";

export type VercelHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<void>;

export function fromVercel(handler: VercelHandler) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    const vercelReq = req as VercelRequest;
    vercelReq.query = Object.fromEntries(url.searchParams.entries());

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk as Buffer));
    req.on("end", () => {
      const raw = Buffer.concat(chunks);
      vercelReq.body = raw.length ? raw : undefined;

      const vercelRes = res as VercelResponse;

      vercelRes.status = function (code: number): VercelResponse {
        res.statusCode = code;
        return this;
      };

      vercelRes.send = function (body: unknown): VercelResponse {
        if (
          typeof body === "object" &&
          body !== null &&
          !Buffer.isBuffer(body)
        ) {
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
    });
  };
}
