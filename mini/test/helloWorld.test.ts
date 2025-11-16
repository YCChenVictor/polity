import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from "supertest";

import { fromVercel } from './setup';
import handler from "../api/hello";

describe('HelloWorld', () => {
  it('Hello World', () => {
    expect(1 + 1).toBe(2);
  });
});

describe("api/hello over HTTP", () => {
  it("returns 200 and JSON body", async () => {
    const app = fromVercel(handler);
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(typeof response.body.msg).toBe("string");
    expect(response.body.msg.length).toBeGreaterThan(0);
  });
});
