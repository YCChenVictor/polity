import {  readContract } from "@wagmi/core";
import { wagmiConfig } from "../wagmiConfig";
import VoteJson from "../../../smart-contracts/out/Vote.sol/Vote.json";

const get = async (account: `0x${string}`): Promise<bigint> => {
  const balance = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_VOTE_ADDRESS,
    abi: VoteJson.abi,
    functionName: "balanceOf",
    args: [account],
  });
  return balance as bigint;
}

export const reward = { get };
