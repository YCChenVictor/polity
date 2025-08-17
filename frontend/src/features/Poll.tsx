import { useReadContract } from "wagmi";

import List from "./poll/List";
import Create from "./poll/Create";

import { pollAbi } from "../generated";

function Poll({ address }: { address: `0x${string}` }) {
  useReadContract({
    address: address,
    abi: pollAbi,
    functionName: "list",
  }); // keep if you need it elsewhere

  return (
    <>
      <Create address={address} />
      <div className="mt-4">
        <List address={address} />
      </div>
    </>
  );
}

export default Poll;
