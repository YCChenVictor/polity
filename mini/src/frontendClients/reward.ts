import {  writeContract, readContract, waitForTransactionReceipt } from "@wagmi/core";
import { getAddress } from "viem";
import { wagmiConfig } from "../wagmiConfig";
import VoteJson from "../../../smart-contracts/out/Vote.sol/Vote.json";
import { ensureAccount } from "./base";

// delegateSelf connects the current wallet, then sends a delegate(account) transaction to the Vote token so that this wallet’s token balance is converted into voting power (needed to reach proposalThreshold and create proposals).
const delegateSelf = async () => {
  const account = await ensureAccount();

  const hash = await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS as `0x${string}`,
    abi: VoteJson.abi,
    functionName: "delegate",
    args: [account],
    account,
  });

  return waitForTransactionReceipt(wagmiConfig, { hash });
};

const getMyVotes = async (account: `0x${string}`): Promise<bigint> => {
  const votes = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS as `0x${string}`,
    abi: VoteJson.abi,
    functionName: "getVotes",
    args: [account],
  });

  return votes as bigint;
};

const get = async (account: `0x${string}`): Promise<bigint> => {
  const addr = getAddress(account);

  const balance = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS,
    abi: VoteJson.abi,
    functionName: "balanceOf", // balanceOf(address) is a read-only ERC-20 token function that returns how many tokens (not votes) an address holds, while voting power is usually exposed separately (e.g. via getVotes).
    args: [addr],
  });
  return balance as bigint;
}

export const reward = { getMyVotes, delegateSelf, get };
