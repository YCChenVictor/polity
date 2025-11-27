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
      const body = req.body;

      let buffer: Buffer;

      if (Buffer.isBuffer(body)) {
        buffer = body;
      } else if (body instanceof Uint8Array) {
        buffer = Buffer.from(body);
      } else if (typeof body === "string") {
        buffer = Buffer.from(body);
      } else if (body == null) {
        buffer = Buffer.alloc(0);
      } else {
        // fallback if someone sends JSON here
        buffer = Buffer.from(JSON.stringify(body));
      }

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

  if (req.method === "GET") {
    try {
      const nameFilter = req.query.name as string | undefined;
      const files = await list(dir);

      if (nameFilter) {
        const file = files.find((f) => f.name === nameFilter);
        if (!file) {
          res.status(404).send("Not Found");
          return;
        }
        res.status(200).json(file);
        return;
      }

      res.status(200).json(files);
      return;
    } catch {
      res.status(500).json({ error: "Failed to list files" });
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

  res.status(405).send("Method Not Allowed");
}
