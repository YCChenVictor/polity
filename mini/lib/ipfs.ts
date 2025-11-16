import { create } from 'ipfs-http-client';

const ipfs = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

// mfs = Mutable File System

type StoredFile = {
  buffer: Buffer;
  name: string;
  size: number;
};


interface UploadResult {
  cid: string;
  name: string;
  size: number;
} 

interface MfsEntry {
  name: string;
  type: "file" | "dir";
  size: number;
  cid: string;
}

const mutableFS = {
  async mkdir(path: string, opts?: { parents?: boolean }) {
    await ipfs.files.mkdir(path, { parents: opts?.parents ?? false });
  },

  async writeBytes(bytes: Uint8Array | Buffer, path: string) {
    await ipfs.files.write(path, bytes, {
      create: true,
      parents: true,
      truncate: true,
    });
  },

  async stat(path: string) {
    return ipfs.files.stat(path); // returns { cid, size, ... }
  },
};

const normalizeDir = (d: string) => {
  return d.startsWith("/") ? d : `/${d}`;
};

// Each time you “change” a file via MFS, IPFS creates a new immutable CID without deleting the old one, so storage keeps growing unless you explicitly clean up or run garbage collection.
const store = async (
  buffer: Buffer,
  name: string,
  size: number,
  dir: string,
): Promise<UploadResult> => {
  const base = normalizeDir(dir);

  await mutableFS.mkdir(base, { parents: true });

  const safeName = name.replace(/[/\\]/g, '_');
  const fullPath = `${base}/${safeName}`;

  await mutableFS.writeBytes(buffer, fullPath);
  const stat = await mutableFS.stat(fullPath);

  return {
    cid: stat.cid.toString(),
    name,
    size,
  };
};

const mfsList = async (path = "/"): Promise<MfsEntry[]> => {
  const p = normalizeDir(path);
  const out: MfsEntry[] = [];
  for await (const e of mutableFS.ls(p)) {
    out.push({
      name: e.name,
      type: e.type === "directory" ? "dir" : "file",
      size: Number(e.size ?? 0),
      cid: e.cid?.toString?.() ?? "",
    });
  }
  return out;
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

export { mutableFS, store, mfsList };
