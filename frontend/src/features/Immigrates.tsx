import ListImmigrates from "./immigrates/ListImmigrates";
import Application from "./immigrates/Applications";
import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";
import { useEffect } from "react";

function Immigrates({
  govAddress,
  userAddress,
  onSetupComplete,
}: {
  govAddress: `0x${string}`;
  userAddress: `0x${string}`;
  onSetupComplete: () => void;
}) {
  const { data: isGovernor } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "isGovernor",
    args: [userAddress],
  });

  useEffect(() => {
    if (isGovernor !== undefined) {
      onSetupComplete();
    }
  }, [isGovernor, onSetupComplete]);

  return (
    <>
      {isGovernor && <Application />}
      <ListImmigrates govAddress={govAddress} />
    </>
  );
}

export default Immigrates;
