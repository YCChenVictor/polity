import { ipfs } from "./backendClients/ipfs";
import { getPublicClient } from "@wagmi/core";

import { ai } from "./backendClients/ai";
import { auth } from "./auth";
import { base } from "./frontendClients/base";
import { agora } from "./frontendClients/agora";
import { reward } from "./frontendClients/reward";
import { citizen } from "./frontendClients/citizen";

import wagmiConfig from "./wagmiConfig";

const modules = { citizen, auth, ai, base, reward, agora, ipfs };
Object.assign(window, modules);

const accounts = await window.ethereum.request({
  method: "eth_requestAccounts",
});
const address = accounts[0];
console.log("current user address:", address);
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
