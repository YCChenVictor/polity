import axios from "axios";
import FormData from "form-data";

const ipfsUrl = process.env.VITE_IPFS_API_URL;
if (!ipfsUrl) {
  throw Error("NO VITE_IPFS_API_URL");
}

interface UploadResult {
  cid: string;
  name: string;
  size: number;
  dir: string;
}

const mfsLs = async (path: string) => {
  const base = path.startsWith("/") ? path : `/${path}`;

  const url =
    `${ipfsUrl}/api/v0/files/ls` +
    `?arg=${encodeURIComponent(base)}` +
    `&long=true&cid-base=base58btc`;

  const res = await axios.post(url);

  if (res.status !== 200) {
    throw new Error(`mfsLs failed: ${res.status}`);
  }

  const data = res.data as {
    Entries?: {
      Name: string;
      Hash?: string;
      Size: number;
      Type: number;
    }[];
  };

  const entries = data.Entries ?? [];

  return entries.map((e) => ({
    name: e.Name,
    cid: e.Hash,
    size: e.Size,
  }));
};

const mfsWrite = async (data: Buffer, path: string) => {
  if (!Buffer.isBuffer(data) || data.length === 0) {
    throw new Error("mfsWrite: data buffer is empty");
  }

  const url =
    `${ipfsUrl}/api/v0/files/write` +
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
    `${ipfsUrl}/api/v0/files/stat` + `?arg=${encodeURIComponent(path)}`;

  const res = await axios.post(url);
  return res.data as { Hash: string; Size: number };
};

// Each time you “change” a file via MFS, IPFS creates a new immutable CID without deleting the old one, so storage keeps growing unless you explicitly clean up or run garbage collection.
const store = async (
  buffer: Buffer,
  name: string,
  dir: string,
): Promise<UploadResult> => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("store: buffer is empty");
  }

  const base = dir.startsWith("/") ? dir : `/${dir}`;

  const normalizedDir = base.endsWith("/") ? base.slice(0, -1) : base;
  const mfsPath = `${normalizedDir}/${name}`;

  await mfsWrite(buffer, mfsPath);
  const stat = await mfsStat(mfsPath);

  return {
    cid: stat.Hash,
    name,
    size: stat.Size,
    dir: normalizedDir,
  };
};

const storeText = async (text: string, name: string, dir: string) => {
  const buf = Buffer.from(text, "utf8");
  return store(buf, name, dir); // returns { cid, name, size, dir }
};

const mfsRead = async (mfsPath: string): Promise<Buffer> => {
  const url =
    `${ipfsUrl}/api/v0/files/read?` +
    new URLSearchParams({ arg: mfsPath }).toString();

  const res = await axios.post(url, null, {
    responseType: "arraybuffer",
  });

  return Buffer.from(res.data);
};

const read = async (dir: string, name: string): Promise<Buffer> => {
  const mfsPath = `${dir}/${name}`;
  return mfsRead(mfsPath); // returns Buffer
};

const readText = async (dir: string, name: string): Promise<string> => {
  const buf = await read(dir, name);
  return buf.toString("utf8");
};

const readCidText = async (cid: string): Promise<string> => {
  const url = `${ipfsUrl}/api/v0/cat?arg=${cid}`;
  const res = await axios.post(url, null, { responseType: "arraybuffer" });
  return Buffer.from(res.data).toString("utf8");
};

const list = async (dir: string): Promise<UploadResult[]> => {
  const base = dir.startsWith("/") ? dir : `/${dir}`;
  const normalizedDir = base.endsWith("/") ? base.slice(0, -1) : base;
  const files: UploadResult[] = [];

  for await (const entry of await mfsLs(normalizedDir)) {
    const fullPath = `${normalizedDir}/${entry.name}`;
    const stat = await mfsStat(fullPath); // { Hash: string; Size: number }

    const cid = stat.Hash ?? entry.cid?.toString?.();
    if (!cid) continue; // or throw, if you prefer

    files.push({
      cid: stat.Hash ?? entry.cid?.toString?.(),
      name: entry.name,
      size: stat.Size,
      dir: normalizedDir,
    });
  }

  return files;
};

// async mfsStat(path: string) {
//   const p = this.normalizePath(path);
//   return this.ipfs.files.stat(p);
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

export { readCidText, store, readText, storeText, list, UploadResult };
