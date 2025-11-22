import ipfsClient from "ipfs-http-client";
import axios from "axios";
import FormData from "form-data";

const IPFS_API_URL = process.env.IPFS_API_URL ?? "http://127.0.0.1:5001";

const ipfs = ipfsClient({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

interface UploadResult {
  cid: string;
  name: string;
  size: number;
} 

const mfsLs = (path: string) => {
  return ipfs.files.ls(path);
};


const mfsWrite = async (data: Buffer, path: string) => {
  if (!Buffer.isBuffer(data) || data.length === 0) {
    throw new Error("mfsWrite: data buffer is empty");
  }

  const url =
    `${IPFS_API_URL}/api/v0/files/write` +
    `?arg=${encodeURIComponent(path)}` +
    `&create=true&parents=true&truncate=true`;

  const form = new FormData();

  form.append("file", data, {
    filename: "file",
    contentType: "application/octet-stream",
  });

  await axios.post(url, form, {
    headers: {
      ...form.getHeaders(),
    },
    maxBodyLength: Infinity,
  });
};

const mfsStat = async (path: string) => {
  const url =
    `${IPFS_API_URL}/api/v0/files/stat` +
    `?arg=${encodeURIComponent(path)}`;

  const res = await axios.post(url);
  return res.data as { Hash: string; Size: number };
}


// Each time you “change” a file via MFS, IPFS creates a new immutable CID without deleting the old one, so storage keeps growing unless you explicitly clean up or run garbage collection.
const store = async (
  buffer: Buffer,
  name: string,
  size: number,
  dir: string,
): Promise<UploadResult> => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("store: buffer is empty");
  }

  const base = dir.startsWith("/") ? dir : `/${dir}`;
  const safeName = name.replace(/[/\\]/g, "_");
  const fullPath = `${base}/${safeName}`;

  await mfsWrite(buffer, fullPath);
  const stat = await mfsStat(fullPath);

  return {
    cid: stat.Hash,
    name,
    size: size ?? buffer.length,
  };
};

const list = async (dir: string): Promise<UploadResult[]> => {
  const base = dir.startsWith("/") ? dir : `/${dir}`;
  const files: UploadResult[] = [];

  for await (const entry of mfsLs(base)) {
    const fullPath = `${base}/${entry.name}`;
    const stat = await mfsStat(fullPath); // typed as { Hash: string; Size: number }

    files.push({
      cid: stat.Hash ?? entry.cid?.toString?.(),
      name: entry.name,
      size: stat.Size,
    });
  }

  return files;
};

// async mfsStat(path: string) {
//   const p = this.normalizePath(path);
//   return this.ipfs.files.stat(p);
// }

// async mfsWrite(path: string, data: Uint8Array | Buffer): Promise<void> {
//   const p = this.normalizePath(path);
//   await this.ipfs.files.write(p, data, {
//     create: true,
//     parents: true,
//     truncate: true,
//   });
// }

// async mfsWriteJson(path: string, obj: unknown): Promise<void> {
//   await this.mfsWrite(path, Buffer.from(JSON.stringify(obj, null, 2)));
// }

// async mfsRead(cid: string): Promise<Buffer> {
//   const chunks: Uint8Array[] = [];
//   for await (const ch of this.ipfs.cat(cid)) chunks.push(ch);
//   return Buffer.concat(chunks as Buffer[]);
// }

// async snapshotAndPin(
//   path: string,
//   recursive = true,
// ): Promise<{ cid: string }> {
//   const p = this.normalizePath(path);
//   await this.ipfs.files.flush(p);
//   const stat = await this.ipfs.files.stat(p);
//   const cid = stat.cid.toString();
//   await this.ipfs.pin.add(cid, { recursive });
//   return { cid };
// }

// async listPinned(): Promise<{ cid: string }[]> {
//   const out: { cid: string }[] = [];
//   for await (const p of this.ipfs.pin.ls({ type: "recursive" })) {
//     out.push({ cid: p.cid.toString() });
//   }
//   return out;
// }

export { mutableFS, store, list };
