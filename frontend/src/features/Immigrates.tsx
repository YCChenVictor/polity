import ListImmigrates from "./immigrates/ListImmigrates";
import CreateImmigrate from "./immigrates/CreateImmigrate";
import { useReadContract } from "wagmi";
import { baseGovernanceAbi } from "../generated";

function Immigrate({
  contractAddress,
  userAddress,
}: {
  contractAddress: `0x${string}`;
  userAddress: `0x${string}`;
}) {
  const { data: isGovernor } = useReadContract({
    address: contractAddress,
    abi: baseGovernanceAbi,
    functionName: "isGovernor",
    args: [userAddress],
  });

  return (
    <>
      {isGovernor && <CreateImmigrate />}
      <ListImmigrates />
    </>
  );
}

export default Immigrate;
