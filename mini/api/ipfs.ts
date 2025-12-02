import type { VercelRequest, VercelResponse } from "@vercel/node";
import { store, list } from "../lib/ipfs";
import { readRawBody } from "../lib/helper";
import { getSessionFromRequest } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const nameParam = req.query.name;
  const dirParam = req.query.dir;

  const name =
    typeof nameParam === "string" && nameParam.length > 0
      ? nameParam
      : "file.bin";

  const dir =
    typeof dirParam === "string" && dirParam.length > 0 ? dirParam : "/uploads";

  if (req.method === "POST") {
    try {
      const buffer = await readRawBody(req);

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

  res.status(405).json({ error: "Method not allowed" });
}
