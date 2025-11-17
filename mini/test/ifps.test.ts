import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from "supertest";

import { fromVercel } from './setup';
import handler from "../api/ipfs"

// Start the docker first: docker compose up --build
describe("IPFS files API", () => {
  const dir = "/perm/users/1/files";

  it("stores a file and then lists it", async () => {
    const app = fromVercel(handler);
    const fileName = "test.txt";
    const body = "hello world";
    const fileContent = "hello world";

    // POST store
    const uploadRes = await request(app)
      .post("/")
      .query({ name: fileName, dir })
      .send(fileContent);

    expect(uploadRes.status).toBe(200);

    // GET list
    const listRes = await request(app)
      .get("/")
      .query({ dir });

    console.log(listRes.body)

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: fileName,
        size: fileContent.length,   // 👈 same variable
        cid: uploadRes.body.cid,
      }),
    ]),
  );
  });
});
