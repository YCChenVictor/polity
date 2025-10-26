import { describe, it } from "vitest";
import request from "supertest";

import app from "../../src/app";

describe("POST /events", () => {
  const dirPath = "/test";

  it("should call ipfs.mfsCreate and return result on success", async () => {
    const fakeFileBuffer = Buffer.from("dummy content");

    await request(app)
      .post("/events")
      .field("dir", dirPath)
      .attach("file", fakeFileBuffer, {
        filename: "test.txt",
        contentType: "text/plain",
      })
      .expect(201);
  });
});
