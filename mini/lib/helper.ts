import { VercelRequest } from "@vercel/node";

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    // chunk can be string or Buffer
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(chunk as Buffer);
    }
  }

  return Buffer.concat(chunks);
}

export { readRawBody };
