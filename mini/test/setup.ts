// test/setup.ts (or fromVercel.ts)
import http from 'http';

type VercelHandler = (req: any, res: any) => any | Promise<any>;

export function fromVercel(handler: VercelHandler) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const vercelRes = {
      status(code: number) {
        res.statusCode = code;
        return this;
      },
      setHeader(name: string, value: string) {
        res.setHeader(name, value);
        return this;
      },
      send(body: any) {
        if (
          typeof body === 'object' &&
          body !== null &&
          !Buffer.isBuffer(body)
        ) {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
          res.end(JSON.stringify(body));
        } else {
          res.end(body);
        }
        return this;
      },
      json(body: any) {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.end(JSON.stringify(body));
        return this;
      },
    };

    Promise.resolve(handler(req as any, vercelRes as any)).catch((err) => {
      console.error(err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
  };
}
