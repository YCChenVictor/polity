// import Create from "./governors/GovernorCreate";
import OffChainList from "./governors/OffChainGovernorList";
import OnChainList from "./governors/OnChainGovernorList";
import { useEffect } from "react";

function governors({
  // address,
  onSetupComplete,
}: {
  address: `0x${string}`;
  onSetupComplete: () => void;
}) {
  // simulate step completion after mounting (or replace with actual condition)
  useEffect(() => {
    onSetupComplete();
  }, [onSetupComplete]);

  return (
    <>
      {/* <Create address={address} /> */}
      <OnChainList />
      <OffChainList />
    </>
  );
}

export default governors;
