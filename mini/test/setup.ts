import http from "http";
import type { VercelRequest, VercelResponse } from "@vercel/node";

type VercelHandler = (req: VercelRequest, res: VercelResponse) => any;

export function fromVercel(handler: VercelHandler) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    // --- build a Vercel-like req ---
    const url = new URL(req.url ?? "/", "http://localhost");

    const vercelReq = req as any as VercelRequest;
    vercelReq.query = Object.fromEntries(url.searchParams.entries());

    // collect body
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk as Buffer));
    req.on("end", () => {
      const raw = Buffer.concat(chunks);
      // you can parse JSON here if you want; for now keep Buffer
      (vercelReq as any).body = raw.length ? raw : undefined;

      // --- build a Vercel-like res ---
      const vercelRes: VercelResponse = {
        status(code: number) {
          res.statusCode = code;
          return this;
        },
        setHeader(name: string, value: string) {
          res.setHeader(name, value);
          return this;
        },
        send(body: any) {
          if (
            typeof body === "object" &&
            body !== null &&
            !Buffer.isBuffer(body)
          ) {
            if (!res.getHeader("Content-Type")) {
              res.setHeader(
                "Content-Type",
                "application/json; charset=utf-8",
              );
            }
            res.end(JSON.stringify(body));
          } else {
            res.end(body);
          }
          return this;
        },
        json(body: any) {
          if (!res.getHeader("Content-Type")) {
            res.setHeader(
              "Content-Type",
              "application/json; charset=utf-8",
            );
          }
          res.end(JSON.stringify(body));
          return this;
        },
      } as any;

      Promise.resolve(handler(vercelReq, vercelRes)).catch((err) => {
        console.error(err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });
    });
  };
}
