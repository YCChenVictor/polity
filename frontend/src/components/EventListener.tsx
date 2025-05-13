import { useWatchContextUpgradeableInitializedEvent } from "../generated";

export default function EventListener() {
  useWatchContextUpgradeableInitializedEvent({
    address: "0xYourContractAddress",
    onLogs: (logs) => {
      console.log("Initialized event logs:", logs);
    },
  });

  return <div>Listening for Initialized events...</div>;
}
