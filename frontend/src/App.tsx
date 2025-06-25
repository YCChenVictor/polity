import { useAccount, useReadContract } from "wagmi";
import { polityGovernmentAbi } from "./generated";
import ConnectButton from "./components/ConnectButton";

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export default function GovernorList() {
  const { isConnected } = useAccount();

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

  if (!isConnected) {
    return <ConnectButton />;
  }

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
