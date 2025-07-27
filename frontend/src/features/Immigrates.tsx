import ListImmigrates from "./immigrates/ListImmigrates";
import Application from "./immigrates/Applications";
import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";

function Immigrates({
  govAddress,
  userAddress,
}: {
  govAddress: `0x${string}`;
  userAddress: `0x${string}`;
}) {
  const { data: isGovernor } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "isGovernor",
    args: [userAddress],
  });

  console.log("zxcvzxcv");
  console.log(isGovernor);

  return (
    <>
      {isGovernor && <Application />}
      <ListImmigrates govAddress={govAddress} />
    </>
  );
}

export default Immigrates;
