import { describe, it, expect } from "vitest";

import { mfsCreate, mfsList } from "../../../src/services/ipfs";

describe("IpfsService", () => {
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

      // optional: verify it’s listed
      const list = await mfsList("/staging");
      expect(list.some((f) => f.name === "a.txt")).toBe(true);
    });
  });
});
