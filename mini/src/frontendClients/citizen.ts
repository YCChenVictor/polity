import { getPublicClient } from "@wagmi/core";

import CitizenJson from "../../../contracts/out/Citizen.sol/Citizen.json";
import wagmiConfig from "../wagmiConfig";

const pc = getPublicClient(wagmiConfig);

const getAllApprovedEvents = async () => {
  const logs = await pc.getContractEvents({
    address: import.meta.env.VITE_CITIZEN_ADDRESS as `0x${string}`,
    abi: CitizenJson.abi,
    eventName: "EventApproved",
    fromBlock: 0n,
    toBlock: "latest",
  });

  // logs[i].args = { cidHash, proposer, timestamp }
  return logs.map((log) => log.args);
};

export const citizen = {
  getAllApprovedEvents,
};
