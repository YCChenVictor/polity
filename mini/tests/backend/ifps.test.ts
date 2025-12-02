import { describe, it, expect } from "vitest";
import request from "supertest";

import { fromVercel } from "../setup";
import handler from "../../api/ipfs";

describe("IPFS files API", () => {
  it("stores a file and then lists it", async () => {
    const app = fromVercel(handler);
    const fileName = "test.txt";
    const dir = "/uploads";
    const fileContent = "hi";

    // POST store
    const uploadRes = await request(app)
      .post("/api/ipfs")
      .query({ name: fileName, dir })
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.from(fileContent));

    expect(uploadRes.status).toBe(200);

    // GET list
    const listRes = await request(app).get("/").query({ dir });

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: fileName,
          size: fileContent.length,
          cid: uploadRes.body.cid,
        }),
      ]),
    );
  });
});
