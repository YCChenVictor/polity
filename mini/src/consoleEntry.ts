import * as Client from "./frontendClient";
import { ipfsClient } from "./ipfsClient";

declare global {
  interface Window {
    ipfsClient: typeof ipfsClient;
  }
}

Object.assign(window, { ipfsClient });
Object.assign(window, { Client, ipfsClient });

const helpers = { Client, ipfsClient };
const lines = Object.entries(helpers).flatMap(([name, obj]) =>
  Object.keys(obj as Record<string, unknown>).map(
    (method) => `  await ${name}.${method}(/* ... */)`
  )
);

// ifps
// await ipfsClient.add(new File(["hi"], "test.txt"))
// await ipfsClient.list()

console.log(`Dev helpers loaded:\n\n${lines.join("\n")}\n`);
