// api/upload.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';
import { store } from '../lib/ipfs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { buffer, fileName, size } = await new Promise<{
      buffer: Buffer;
      fileName: string;
      size: number;
    }>((resolve, reject) => {
      const bb = Busboy({ headers: req.headers });

      let chunks: Buffer[] = [];
      let fileName = '';
      let size = 0;

      bb.on('file', (_field, stream, info) => {
        fileName = info.filename;
        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
          size += chunk.length;
        });
        stream.on('end', () => {
          resolve({
            buffer: Buffer.concat(chunks),
            fileName,
            size,
          });
        });
      });

      bb.on('error', reject);
      req.pipe(bb);
    });

    const userId = "1"

    const result = await store(buffer, fileName, size, `/perm/users/${userId}/files`);
    res.status(200).json(result);
  } catch (err) {
    console.error('upload failed', err);
    res.status(500).json({ error: 'upload failed' });
  }
}