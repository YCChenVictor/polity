import { createHelia } from "helia";
import type { Helia } from "helia";
import { mfs } from "@helia/mfs";
import type { MFS } from "@helia/mfs";

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

class IpfsService {
  private helia!: Helia;
  private fs!: MFS;
  static async init() {
    const svc = new IpfsService();
    svc.helia = await createHelia();
    svc.fs = mfs(svc.helia);
    return svc;
  }

  private normalizeDir(d: string) {
    return d.startsWith("/") ? d : `/${d}`;
  }

  // mfs
  async mfsCreate(
    file: Express.Multer.File,
    dir = "/staging",
  ): Promise<UploadResult> {
    if (!file) throw new Error("file required");
    const base = this.normalizeDir(dir);
    type MkdirOpts = Parameters<MFS["mkdir"]>[1]; // use method’s param type to avoid clashes
    await this.fs.mkdir(base, { parents: true } as MkdirOpts);

    const p = `${base}/${file.originalname.replace(/[/\\]/g, "_")}`;
    await this.fs.writeBytes(file.buffer, p); // swap args if your version requires
    const stat = await this.fs.stat(p);
    return {
      cid: stat.cid.toString(),
      name: file.originalname,
      size: file.size,
    };
  }

  async mfsList(path = "/"): Promise<MfsEntry[]> {
    const p = this.normalizeDir(path);
    const out: MfsEntry[] = [];
    for await (const e of this.fs.ls(p)) {
      out.push({
        name: e.name,
        type: e.type === "directory" ? "dir" : "file",
        size: Number(e.size ?? 0),
        cid: e.cid?.toString?.() ?? "",
      });
    }
    return out;
  }

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
}

export default IpfsService;
export { UploadResult };
