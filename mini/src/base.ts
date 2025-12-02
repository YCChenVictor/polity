import { connect, getAccount, getPublicClient } from "@wagmi/core";
import { PublicClient, Hash } from "viem";
import { injected } from "@wagmi/connectors";

import wagmiConfig from "./wagmiConfig";

interface EnsuredAccount {
  address: `0x${string}`;
  chainId: number;
}

const mode = import.meta.env.MODE ?? "development";
const isTest = mode === "test";

export const TEST_ACCOUNT: EnsuredAccount = {
  address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  chainId: 31337,
};

const ensureAccount = async (): Promise<EnsuredAccount> => {
  if (isTest) return TEST_ACCOUNT; // make TEST_ACCOUNT match EnsuredAccount

  const acc = getAccount(wagmiConfig);

  if (acc.status === "connected" && acc.address && acc.chainId) {
    return { address: acc.address as `0x${string}`, chainId: acc.chainId };
  }

  const { accounts, chainId } = await connect(wagmiConfig, {
    connector: injected({ shimDisconnect: true }),
  });

  if (!accounts[0]) {
    throw new Error("No account returned from wallet");
  }

  return { address: accounts[0] as `0x${string}`, chainId };
};

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

  return tx;
};

export const base = {
  checkTx,
  ensurePublicClient,
  getCurrentBlock,
  ensureAccount,
  mineBlocks,
};
