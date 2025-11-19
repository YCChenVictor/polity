import { getAccount, readContract, writeContract } from "@wagmi/core";
import wagmiConfig from "../wagmiConfig";
import { helloWorldAbi, citizenAbi, agoraAbi } from "../generated";
import { ensureAccount } from "./base";

const citizenAddress = import.meta.env.VITE_CITIZEN_ADDRESS as `0x${string}`;

const HELLO_WORLD_ADDRESS = import.meta.env.VITE_HELLO_WORLD_ADDRESS as `0x${string}`;

export async function getGreeting(): Promise<string> {
  const result = await readContract(wagmiConfig, {
    address: HELLO_WORLD_ADDRESS,
    abi: helloWorldAbi,
    functionName: "getGreeting",
  });

  return result as string;
}

const create = async ({cid}: {cid: `0x${string}`}) => {
  const account = await ensureAccount();

  const agoraAddress = await readContract(wagmiConfig, {
    address: citizenAddress,
    abi: citizenAbi,
    functionName: 'agoraAddress',
  });

  const tx = await writeContract(wagmiConfig, {
    address: agoraAddress,
    abi: agoraAbi,
    functionName: 'proposeIPFSEvent',
    args: [cid],
    account,
  });

  return tx;
};

const list = async () => {
  const account = await ensureAccount();

  const agoraAddress = await readContract(wagmiConfig, {
    address: citizenAddress,
    abi: citizenAbi,
    functionName: 'agoraAddress',
  });

  const tx = await readContract(wagmiConfig, {
    address: agoraAddress,
    abi: agoraAbi,
    functionName: 'proposals',
    args: [0n, 10n],
    account,
  });

  return tx;
};

export const agora = { create, list };
