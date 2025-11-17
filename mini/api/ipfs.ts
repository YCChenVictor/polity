// api/ipfs/files.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buffer as readBuffer } from "node:stream/consumers";
import Busboy from 'busboy';
import { store, list } from "../lib/ipfs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const dir = (req.query.dir as string) ?? "/uploads";
  const fileNameParam = req.query.name as string | undefined;
  const fileName = fileNameParam ?? "file";

    if (req.method === "POST") {
      const { buffer, size } = await new Promise<{ buffer: Buffer; size: number }>(
        (resolve, reject) => {
          const chunks: Buffer[] = [];
          let totalSize = 0;

          req.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
            totalSize += chunk.length;
          });

          req.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve({ buffer, size: totalSize });
          });

          req.on("error", (err) => reject(err));
        },
      );

      console.log("[api/ipfs] buffer length =", buffer.length);

      const result = await store(buffer, fileName, size, dir);
      res.status(200).json(result);
      return;
    }

    // if (req.method === "PUT") {
    //   // update (only if exists)
    //   const name = req.query.name as string;
    //   if (!name) return res.status(400).send("Missing name");

    //   const base = dir.startsWith("/") ? dir : `/${dir}`;
    //   const path = `${base}/${name.replace(/[/\\]/g, "_")}`;

    //   // 404 if file not found
    //   await mfsStat(path).catch(() => {
    //     return res.status(404).send("Not Found");
    //   });

    //   const body = req.body as string | Buffer;
    //   const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);

    //   const result = await store(buf, name, buf.length, dir);
    //   return res.status(200).json(result);
    // }

    if (req.method === "GET") {
      const name = req.query.name as string | undefined;
      const files = await list(dir);

      if (name) {
        const file = files.find((f) => f.name === name);
        if (!file) return res.status(404).send("Not Found");
        return res.status(200).json(file);
      }

      return res.status(200).json(files);
    }

    res.status(405).send("Method Not Allowed");
}
