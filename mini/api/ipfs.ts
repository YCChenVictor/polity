import type { VercelRequest, VercelResponse } from "@vercel/node";
import { store, list } from "../lib/ipfs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const nameParam = req.query.name;
  const dirParam = req.query.dir;

  const name =
    typeof nameParam === "string" && nameParam.length > 0
      ? nameParam
      : "file.bin";

  const dir =
    typeof dirParam === "string" && dirParam.length > 0
      ? dirParam
      : "/uploads";

  if (req.method === "POST") {
    try {
      const chunks: Buffer[] = [];

      for await (const chunk of req) {
        chunks.push(
          Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
        );
      }

      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        res.status(400).json({ error: "Empty body" });
        return;
      }

      const result = await store(buffer, name, dir);
      res.status(200).json(result);
      return;
    } catch {
      res.status(500).json({ error: "Failed to upload file" });
      return;
    }
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
        if (!file) {
          res.status(404).send("Not Found");
          return
        }
        res.status(200).json(file);
        return
      }

      res.status(200).json(files);
      return
    }

    res.status(405).send("Method Not Allowed");
}
