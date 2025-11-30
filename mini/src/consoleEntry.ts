import { ipfs } from "./backendClients/ipfs";
import { getPublicClient } from "@wagmi/core";

import { ai } from "./backendClients/ai";

import { auth } from "./auth";
import { base } from "./frontendClients/base";
import { agora } from "./frontendClients/agora";
import { reward } from "./frontendClients/reward";

import wagmiConfig from "./wagmiConfig";

const modules = { auth, ai, base, reward, agora, ipfs };
Object.assign(window, modules);
const lines = Object.entries(modules).flatMap(([name, obj]) =>
  Object.keys(obj as Record<string, unknown>).map(
    (method) => `  await ${name}.${method}(/* ... */)`,
  ),
);

const pc = getPublicClient(wagmiConfig);
const nodeChainHex = await pc.transport.request({
  method: "eth_chainId",
  params: [],
});
console.log("node", nodeChainHex, parseInt(nodeChainHex, 16));
const blockNumber = await pc?.getBlockNumber();
console.log(blockNumber);
const chainHex = await window.ethereum.request({ method: "eth_chainId" });
console.log(chainHex, parseInt(chainHex, 16));
const nonce = await pc.getTransactionCount({
  address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
});
console.log("node nonce =", nonce);

// Deploy contracts
// cd mini
// yarn chain:dev
// yarn ipfs:dev
// yarn vercel:dev

// await base.getCurrentBlock()
// await base.mineBlocks()
// await base.debugTx("0x4df13158655181804af18e7aed066ceb17b050a4d314a2d12f6bdc809a515412")

// Check who the address in metamask in browser

// The timelock will own citizen contracts. As a result, when agora passed something, then the trigger is timelock with isOwner checker, then we do not need to couple agora and citizen contracts.

// ifps
// await ipfs.add(new File(["hi"], "test.txt"))
// await ipfs.list()

// Vote
// await reward.get("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
// await reward.delegateSelf()
// await reward.getMyVotes("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 13n)
// await reward.fetchProposalVotingPower(72380676904461645790063851811608348709253202756502912104745171844450372884334n, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

// Agora
// await agora.fetchProposalState(72380676904461645790063851811608348709253202756502912104745171844450372884334n)
// await agora.getProposalThreshold()
// await agora.create({cid: "QmYjKbkar8DTEkka34f47D82YX6o1dAcBnVGZZzbBgaiqa"})
// await agora.list()
// await agora.vote(72380676904461645790063851811608348709253202756502912104745171844450372884334n, 1) -> It was the infra problem, nonce, should study it
// await agora.listProposalsWithVotes()

console.log(`Dev helpers loaded:\n\n${lines.join("\n")}\n`);
