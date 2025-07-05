import React from "react";
import { useAccount, useContractRead } from "wagmi";
import { polityGovernmentAbi } from "../../generated";

function GovernorList({ address }: { address: `0x${string}` }) {
  const { isConnected } = useAccount();

  const {
    data: governors,
    error,
    isLoading,
  } = useContractRead({
    address,
    abi: polityGovernmentAbi,
    functionName: "getGovernors",
  });

  if (!isConnected) return <p>Connecting wallet...</p>;
  if (isLoading) return <p>Loading governors…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-2">Governors</h2>
        <ul className="list-disc pl-5">
          {governors?.map((addr, i) => (
            <li key={i} className="mb-1">
              {addr}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default GovernorList;
