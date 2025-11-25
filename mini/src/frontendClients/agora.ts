import { readContract, writeContract, getPublicClient } from "@wagmi/core";
import wagmiConfig from "../wagmiConfig";
import AgoraJson from "../../../smart-contracts/out/Agora.sol/Agora.json";
import { ensureAccount } from "./base";

const getClient = () => {
  const client = getPublicClient(wagmiConfig);
  if (!client) throw new Error("Public client not found (check wagmiConfig)");
  return client;
};

const create = async ({cid}: {cid: string}) => {
  const account = await ensureAccount();

  const tx = await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: "proposeIPFSEvent",
    args: [cid],
    account,
  });

  return tx;
};

const list = async () => {
  const tx = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: 'proposals',
    args: [0n, 10n],
  });

  return tx;
};

const getProposalThreshold = async (): Promise<bigint> => {
  const threshold = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "proposalThreshold",
  });

  return threshold as bigint;
};

export const agora = { getProposalThreshold, getClient, create, list };
