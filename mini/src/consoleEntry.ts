import { agora } from "./frontendClients/agora";
import { ipfs } from "./ipfsClient";
import { reward}  from "./frontendClients/reward";

Object.assign(window, { reward, agora, ipfs });

const helpers = { reward,agora, ipfs };
const lines = Object.entries(helpers).flatMap(([name, obj]) =>
  Object.keys(obj as Record<string, unknown>).map(
    (method) => `  await ${name}.${method}(/* ... */)`
  )
);

// Deploy contracts
// yarn chain:dev

// The timelock will own citizen contracts. As a result, when agora passed something, then the trigger is timelock with isOwner checker, then we do not need to couple agora and citizen contracts.

// ifps
// await ipfs.add(new File(["hi"], "test.txt"))
// await ipfs.list()

// Vote
// await reward.get("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
// Then design the amount of tokens to create agora and vote correctly
// For QA, we need to grant rewards to account, which can only be done by time lock (owner)

// Agora
// await agora.create({cid: "QmNhxMLMvraxE6Jk4JnYPFaErAbvZcDNVomfCN1zovWXXt"})
// await agora.list()
// await agora.vote(67382374969783078288207174974036682229670421070231090340786175762054953740690n, 1n)
// await agora.listProposalsWithVotes()

console.log(`Dev helpers loaded:\n\n${lines.join("\n")}\n`);
