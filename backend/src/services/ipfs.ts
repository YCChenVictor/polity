import { posix as pathPosix } from "path";
import { createHelia } from "helia";
import { mfs } from "@helia/mfs";
import type { MFS } from "@helia/mfs";
import { toString } from "uint8arrays/to-string";

// mfs = Mutable File System

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

const helia = await createHelia();
const mutableFS = mfs(helia);

const normalizeDir = (d: string) => {
  return d.startsWith("/") ? d : `/${d}`;
};

const ensureDir = async (dir: string) => {
  type MkdirOpts = Parameters<MFS["mkdir"]>[1];
  try {
    await mutableFS.mkdir(dir, { parents: true } as MkdirOpts);
  } catch (err: unknown) {
    const e = err as { name?: string; code?: string } | null;
    if (
      !(
        e &&
        (e.name === "AlreadyExistsError" || e.code === "ERR_ALREADY_EXISTS")
      )
    ) {
      throw err;
    }
  }
};

// mfs
const mfsCreate = async (
  file: Express.Multer.File,
  dir: string,
): Promise<UploadResult> => {
  if (!file?.buffer) throw new Error("file required");

  const base = dir?.startsWith("/") ? dir : `/${dir || ""}`;
  await ensureDir(base);

  const safeName = file.originalname.replace(/[\\/]/g, "_");
  const fullPath = pathPosix.join(base, safeName);

  const bytes: Uint8Array = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer);

  await mutableFS.writeBytes(bytes, fullPath);

  const stat = await mutableFS.stat(fullPath);
  if (stat.type === "directory") {
    throw new Error(`Path is a directory: ${fullPath}`);
  }

  return {
    cid: stat.cid.toString(),
    name: file.originalname,
    size: file.size,
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

const readFileFromMfs = async (path: string): Promise<string> => {
  if (!path.startsWith("/")) path = "/" + path;

  let data = "";
  for await (const chunk of mutableFS.cat(path)) {
    // ✅ direct path
    data += toString(chunk);
  }
  return data;
};

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

export { mutableFS, mfsCreate, mfsList, readFileFromMfs };
