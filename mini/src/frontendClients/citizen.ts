import { connect, writeContract } from "@wagmi/core";
import { injected } from "@wagmi/connectors";

import { ensureAccount} from "./base";
import { citizenAbi } from "../generated";
import wagmiConfig from "../wagmiConfig";

const citizenAddress = import.meta.env.VITE_CITIZEN_ADDRESS as `0x${string}`;

const setAgora = async (address: `0x${string}`) => {
  const account = await ensureAccount();

  await writeContract(wagmiConfig, {
    address: citizenAddress,
    abi: citizenAbi,
    functionName: 'setAgora',
    args: [address],
    account,
  });
};

export const citizen = { setAgora };
