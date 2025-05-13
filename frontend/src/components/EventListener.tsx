import { useWatchUpgradeable1InitializedEvent } from "../generated";

export default function EventListener() {
  useWatchUpgradeable1InitializedEvent({
    address: "0xYourContractAddress",
    onLogs: (logs) => {
      console.log("Initialized event logs:", logs);
    },
  });

  return <div>Listening for Initialized events...</div>;
}
