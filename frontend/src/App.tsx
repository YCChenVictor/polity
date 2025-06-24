import { polityGovernmentAbi } from "./generated";
import { useContractRead } from "wagmi";

export default function GovernorList() {
  const { data: governors, isLoading } = useContractRead({
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
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
