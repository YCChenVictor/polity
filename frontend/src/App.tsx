import { polityGovernmentAbi } from "./generated";
import { useReadContract } from "wagmi";

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Double check whether it is the deployed contract's address

export default function GovernorList() {
  const { data: governors, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: polityGovernmentAbi,
    functionName: "getGovernors",
  });

  return (
    <div>
      <h2>Governors</h2>
      {isLoading && <p>Loading...</p>}
      <ul>
        {governors?.map((addr: string, i: number) => <li key={i}>{addr}</li>)}
      </ul>
    </div>
  );
}
