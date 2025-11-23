import { readContract, writeContract } from "@wagmi/core";
import wagmiConfig from "../wagmiConfig";
import AgoraJson from "../../../smart-contracts/out/Agora.sol/Agora.json";
import { ensureAccount } from "./base";

const create = async ({cid}: {cid: `0x${string}`}) => {
  const account = await ensureAccount();

  const tx = await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: 'proposeIPFSEvent',
    args: [cid],
    account,
  });

  return tx;
};

const list = async () => {
  const account = await ensureAccount();

  const tx = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: 'proposals',
    args: [0n, 10n],
    account,
  });

  return tx;
};

export const agora = { create, list };
