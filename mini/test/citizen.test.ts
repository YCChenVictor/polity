import { beforeAll, describe, it, expect } from "vitest";
import {readContract, getBytecode } from "@wagmi/core";

import CitizenJson from "../../smart-contracts/out/Citizen.sol/Citizen.json"
import wagmiConfig from "../src/wagmiConfig";

export const VOTE_ADDRESS = import.meta.env.VITE_VOTE_ADDRESS as `0x${string}`;
export const CITIZEN_ADDRESS = import.meta.env.VITE_CITIZEN_ADDRESS as `0x${string}`;
export const AGORA_ADDRESS = import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`;

async function assertContractDeployed(addr: `0x${string}`) {
  const bytecode = await getBytecode(wagmiConfig, { address: addr });
  if (!bytecode || bytecode === "0x") {
    throw new Error(`No contract deployed at ${addr}`);
  }
}

beforeAll(async () => {
  try {
    await assertContractDeployed(CITIZEN_ADDRESS);

    // // any cheap view calls – if these fail, contracts aren’t there
    // await readContract(wagmiConfig, {
    //   address: VOTE_ADDRESS,
    //   abi: VoteJson.abi as Abi,
    //   functionName: "totalSupply",
    // });

    // await readContract(wagmiConfig, {
    //   address: AGORA_ADDRESS,
    //   abi: AgoraJson.abi as Abi,
    //   functionName: "proposalCount",   // or any simple view
    // });
  } catch {
    throw new Error(
      "Contracts not deployed on local node. Run:\n" +
      "  forge script scripts/DeployPolity.s.sol:DeployPolity " +
      "--rpc-url http://127.0.0.1:8546 --broadcast -vv"
    );
  }
});

describe("Agora voting", () => {
  it("lets an account vote and updates proposalVotes", async () => {

    // use AGORA_ADDRESS / CITIZEN_ADDRESS directly
    const agoraAddressFromCitizen = await readContract(wagmiConfig, {
      address: CITIZEN_ADDRESS,
      abi: CitizenJson.abi,
      functionName: "agora", // or whatever you actually expose
    });

    expect(agoraAddressFromCitizen).toEqual(AGORA_ADDRESS);

    // ...create proposal, castVote, etc using AGORA_ADDRESS
  });
});
