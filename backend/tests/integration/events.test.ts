import { describe, it, beforeAll } from "vitest";
import request from "supertest";
import path from "path";
import { readFileSync } from "fs";

import app from "../../src/app";

import { mfsCreate } from "../../src/services/ipfs";

describe("POST /events", () => {
  const dirPath = "/test";

  beforeAll(async () => {
    const filePath = path.join(__dirname, "../constitution.md");
    const buffer = readFileSync(filePath);

    const fakeRule = {
      originalname: "constitution.md",
      buffer,
      size: buffer.length,
    } as Express.Multer.File;

    await mfsCreate(fakeRule, "/rules");
  });

  it("should call ipfs.mfsCreate and return result on success", async () => {
    const fakeFileBuffer = Buffer.from("dummy content");
    //
    await request(app)
      .post("/events")
      .field("ruleFile", "/rules/constitution.md")
      .field("dir", dirPath)
      .attach("file", fakeFileBuffer, {
        filename: "test.txt",
        contentType: "text/plain",
      })
      .expect(201);
  });
});
