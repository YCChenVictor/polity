import { createHelia } from "helia";
import { mfs } from "@helia/mfs";
import type { MFS } from "@helia/mfs";

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

// mfs
const mfsCreate = async (
  file: Express.Multer.File,
  dir: string,
): Promise<UploadResult> => {
  if (!file) throw new Error("file required");
  const base = normalizeDir(dir);

  type MkdirOpts = Parameters<MFS["mkdir"]>[1]; // use method’s param type to avoid clashes
  await mutableFS.mkdir(base, { parents: true } as MkdirOpts);

  const safeName = file.originalname.replace(/[/\\]/g, "_");
  const fullPath = `${base}/${safeName}`;

  await mutableFS.writeBytes(file.buffer, fullPath); // swap args if your version requires
  const stat = await mutableFS.stat(fullPath);

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

export { mutableFS, mfsCreate, mfsList };
