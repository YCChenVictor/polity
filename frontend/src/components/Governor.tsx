import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function GovernorList() {
  // always call your hooks at top-level
  const {
    data: governors,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: polityGovernmentAbi,
    functionName: "getGovernors",
    // chainId: hardhat.id, // optional if you have multiple chains
  });

  if (isLoading) {
    return <p>Loading governors…</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Governors</h2>
      <ul className="list-disc pl-5">
        {governors?.map((addr: string, i: number) => (
          <li key={i} className="mb-1">
            {addr}
          </li>
        ))}
      </ul>
    </div>
  );
}
