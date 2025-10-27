import { describe, it, expect } from "vitest";

import { mfsCreate, readFileFromMfs } from "../../../src/services/ipfs";

describe("mfsCreate", () => {
  it("writes, stats, returns {cid,name,size}", async () => {
    const file = {
      originalname: "a.txt",
      buffer: Buffer.from("hi"),
      size: 2,
    } as Express.Multer.File;

    const res = await mfsCreate(file, "/staging");

    expect(res.name).toBe("a.txt");
    expect(res.size).toBe(2);
    expect(typeof res.cid).toBe("string");
  });
});

describe("readFileFromMfs", () => {
  it("reads file content from MFS path", async () => {
    const file = {
      originalname: "test.txt",
      buffer: Buffer.from("hi"),
      size: 2,
    } as Express.Multer.File;

    await mfsCreate(file, "/staging");

    const content = await readFileFromMfs("/staging/test.txt");
    console.log(content);
    // expect(result).toBe("hello world");
    // expect(mutableFS.stat).toHaveBeenCalledWith("/test.txt");
    // expect(mutableFS.cat).toHaveBeenCalledWith("CID123");
  });
});
