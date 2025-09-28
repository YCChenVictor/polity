import { useReadContract } from "wagmi";

import { pollAbi, citizenAbi } from "../generated";
import { useCitizenAddress } from "../CitizenAddressContext";
import List from "./poll/List";
import Init from "./poll/Init";

function Poll() {
  const citizenAddress = useCitizenAddress();
  const { data: pollAddress } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "pollAddress",
  });

  if (!pollAddress) {
    return <Init />;
  }

  const { data, isLoading, error } = useReadContract({
    address: pollAddress,
    abi: pollAbi,
    functionName: "currentConfig",
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {String(error)}</p>;
  if (!data) return null;

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
