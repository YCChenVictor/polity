import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from "supertest";
import { create as createIpfs } from 'ipfs-http-client';

import { fromVercel } from './setup';
import handler from "../api/upload"

// Start the docker first
describe('IPFS E2E', () => {
  it('calls /api/ipfs/add and stores data in Docker IPFS', async () => {
    const ipfs = createIpfs({ url: 'http://127.0.0.1:5001/api/v0' });

    const app = fromVercel(handler);

    const res = await request(app).post("/").attach('file', Buffer.from('hello world'), 'test.txt');

    expect(res.status).toBe(200);

    const path = res.body.path ?? '/perm/users/1/files/test.txt';
    expect(path).toBe('/perm/users/1/files/test.txt');

    const chunks: Uint8Array[] = [];
    for await (const chunk of ipfs.files.read(path)) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString('utf8');
    expect(content).toBe('hello world');
  });
});
