import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";

export default function GovernorList({ address }: { address: `0x${string}` }) {
  const {
    data: governors,
    isLoading,
    error,
  } = useReadContract({
    address,
    abi: polityGovernmentAbi,
    functionName: "getGovernors",
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
