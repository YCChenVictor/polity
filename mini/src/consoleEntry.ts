import { agora } from "./frontendClients/agora";
import { ipfs } from "./ipfsClient";
import { citizen } from "./frontendClients/citizen";

Object.assign(window, { citizen, agora, ipfs });

const helpers = { citizen, agora, ipfs };
const lines = Object.entries(helpers).flatMap(([name, obj]) =>
  Object.keys(obj as Record<string, unknown>).map(
    (method) => `  await ${name}.${method}(/* ... */)`
  )
);

// ifps
// await ipfs.add(new File(["hi"], "test.txt"))
// await ipfs.list()

// citizen
// await citizen.setAgora("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9") // Input the address of agora

// agora
// await agora.create({cid: "QmNhxMLMvraxE6Jk4JnYPFaErAbvZcDNVomfCN1zovWXXt"})
// await agora.list()

console.log(`Dev helpers loaded:\n\n${lines.join("\n")}\n`);
