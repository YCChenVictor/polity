import request from "supertest";
import app from "../../src/app";

describe("GET /", () => {
  it("responds with Hello, World! and add a helloWorld job to bullmq", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
