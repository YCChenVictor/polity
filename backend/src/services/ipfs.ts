import { create, type IPFSHTTPClient } from "ipfs-http-client";

export interface UploadResult {
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

export default class IpfsService {
  private ipfs: IPFSHTTPClient;

  constructor(apiUrl = process.env.IPFS_API) {
    if (!apiUrl) throw new Error("IPFS_API not set");
    this.ipfs = create({ url: apiUrl });
  }

  private normalizePath(p: string) {
    return p.startsWith("/") ? p : `/${p}`;
  }

  async mfsCreate(
    file: Express.Multer.File,
    dir = "/staging",
  ): Promise<UploadResult> {
    if (!file) throw new Error("file required");
    const base = this.normalizePath(dir);
    const path = `${base}/${file.originalname}`;

    await this.ipfs.files.write(path, file.buffer, {
      create: true,
      parents: true,
      truncate: true,
    });

    const stat = await this.ipfs.files.stat(path);
    return {
      cid: stat.cid.toString(),
      name: file.originalname,
      size: file.size,
    };
  }

  async mfsList(path = "/"): Promise<UploadResult[]> {
    const p = this.normalizePath(path);
    const out: MfsEntry[] = [];
    for await (const e of this.ipfs.files.ls(p)) {
      out.push({
        name: e.name,
        type: e.type === "directory" ? "dir" : "file",
        size: Number(e.size ?? 0),
        cid: e.cid?.toString?.() ?? "",
      });
    }
    return out;
  }

  async snapshotAndPin(
    path: string,
    recursive = true,
  ): Promise<{ cid: string }> {
    const p = this.normalizePath(path);
    await this.ipfs.files.flush(p);
    const stat = await this.ipfs.files.stat(p);
    const cid = stat.cid.toString();
    await this.ipfs.pin.add(cid, { recursive });
    return { cid };
  }

  async listPinned(): Promise<{ cid: string }[]> {
    const out: { cid: string }[] = [];
    for await (const p of this.ipfs.pin.ls({ type: "recursive" })) {
      out.push({ cid: p.cid.toString() });
    }
    return out;
  }
}
