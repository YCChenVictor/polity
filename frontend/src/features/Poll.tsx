import { useReadContract } from "wagmi";

import { pollAbi } from "../generated";
import List from "./poll/List";

function Poll({ pollAddress }: { pollAddress: `0x${string}` }) {
  const { data, isLoading, error } = useReadContract({
    address: pollAddress,
    abi: pollAbi,
    functionName: "currentConfig",
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {String(error)}</p>;
  if (!data) return null;

  console.log("xzcvzxcvzxcv");
  console.log(pollAddress);
  console.log(data);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800">Poll</h2>
      <List pollAddress={pollAddress} />
      <div className="mt-4 space-y-2 text-gray-700">
        {isLoading && <p>Loading config…</p>}
        {error && <p className="text-red-500">Error loading config</p>}
        <div className="space-y-1 text-gray-700">
          <p>Min Votes Percent: {data?.[0].toString()}%</p>
          <p>Voting Seconds: {data?.[1].toString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Poll;
