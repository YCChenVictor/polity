import { connect, getAccount, getPublicClient } from "@wagmi/core";
import type { PublicClient } from "viem";
import { injected } from "@wagmi/connectors";
import type { Hash } from "viem";

import wagmiConfig from "../wagmiConfig";

const mode = import.meta.env.MODE ?? "development";
const isTest = mode === "test";

export const TEST_ACCOUNT =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as `0x${string}`;

const ensureAccount = async () => {
  if (isTest) {
    return TEST_ACCOUNT;
  }

  const acc = getAccount(wagmiConfig); // getAccount(wagmiConfig) will always give you “whatever wallet is currently connected in the browser for this dapp”
  if (acc.status === "connected" && acc.address) return acc.address;

  const { accounts } = await connect(wagmiConfig, {
    connector: injected({ shimDisconnect: true }),
  });
  return accounts[0];
}

const ensurePublicClient = (): PublicClient => {
  const client = getPublicClient(wagmiConfig);
  if (!client) throw new Error("No public client");
  return client;
};

// A block is one numbered batch of transactions on the blockchain, and currentBlock is just “how many batches have been mined so far.
const getCurrentBlock = async () => {
  const client = await ensurePublicClient();
  const blockNumber = await client.getBlockNumber();
  return blockNumber;
};

const mineBlocks = async (count = 1) => {
  const client = ensurePublicClient();
  await client.transport.request({
    method: "anvil_mine",
    params: [`0x${count.toString(16)}`],
  });
};

const checkTx = async () => {
  const publicClient = getPublicClient(wagmiConfig);
  const tx = await publicClient?.getTransaction({
    hash: "0x398def97215a287e8d4c60fc6aeb1bfb30644798a59ce6ba0ed8ce78f46fad5c" as Hash,
  });

  return tx
};

export const base = { checkTx, ensurePublicClient, getCurrentBlock, ensureAccount, mineBlocks } 
