import Create from "./governors/GovernorCreate";
import OffChainList from "./governors/OffChainGovernorList";
import OnChainList from "./governors/OnChainGovernorList";
import { useEffect } from "react";

function governors({
  address,
  
}: {
  address: `0x${string}`;
}) {
  return (
    <>
      <Create address={address} />
      <OnChainList address={address} />
      {/* <OffChainList /> */}
    </>
  );
}

export default governors;
