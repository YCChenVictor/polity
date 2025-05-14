import { useWatchUpgradeable1InitializedEvent } from "../generated";
import { config } from "../wagmi.config";
import { hardhat } from "wagmi/chains";

export default function EventListener() {
  useWatchUpgradeable1InitializedEvent({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    onLogs: (logs) => {
      console.log("Initialized event logs:", logs);
    },
    onError(err) {
      console.error(err);
    },
  });

  console.log("Hardhat client:", config.getClient({ chainId: hardhat.id }));

  return <div>Listening for Initialized events...</div>;
}
