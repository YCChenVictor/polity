import { useReadContract } from "wagmi";

import List from "./poll/List";
// import Create from "./poll/Create";

import { pollAbi } from "../generated";

function Poll({ address }: { address: `0x${string}` }) {
  useReadContract({
    address: address,
    abi: pollAbi,
    functionName: "list",
  }); // keep if you need it elsewhere

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800">Poll</h2>
      <div className="p-4">
        <List address={address} />
      </div>
    </div>
  );
}

export default Poll;
