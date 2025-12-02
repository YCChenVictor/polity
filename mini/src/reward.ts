import {
  writeContract,
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { getAddress } from "viem";
import wagmiConfig from "./wagmiConfig";
import VoteJson from "../../../contracts/out/Vote.sol/Vote.json";
import AgoraJson from "../../../contracts/out/Agora.sol/Agora.json";
import { base } from "./base";
import type { Hash } from "viem";

// delegateSelf connects the current wallet, then sends a delegate(account) transaction to the Vote token so that this wallet’s token balance is converted into voting power (needed to reach proposalThreshold and create proposals).
const delegateSelf = async () => {
  const accountInfo = await base.ensureAccount();

  const hash = await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS as `0x${string}`,
    abi: VoteJson.abi,
    functionName: "delegate",
    args: [accountInfo.address],
    account: accountInfo.address,
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    hash: hash as Hash,
    // so it doesn't hang forever:
    timeout: 10_000, // 10 seconds
    pollingInterval: 1_000, // poll every 1s
  });

  return receipt;
};

const getMyVotes = async (
  account: `0x${string}`,
  blockNumber: bigint,
): Promise<bigint> => {
  const votes = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "getVotes",
    args: [account, blockNumber],
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
};

export const fetchProposalVotingPower = async (
  id: bigint,
  account: `0x${string}`,
) => {
  const snapshot = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: "proposalSnapshot",
    args: [id],
  });

  return readContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS,
    abi: VoteJson.abi,
    functionName: "getPastVotes",
    args: [account, snapshot],
  });
};

export const reward = {
  fetchProposalVotingPower,
  getMyVotes,
  delegateSelf,
  get,
};
