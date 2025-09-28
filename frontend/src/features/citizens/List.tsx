import type { Address } from "viem";
import { useReadContract } from "wagmi";

import { citizenAbi } from "../../generated";

import { useCitizenAddress } from "../../CitizenAddressContext";

interface CitizenView {
  id: bigint; // uint256 -> bigint
  wallet: Address; // address
  reasonCode: number; // uint8 -> number
}

function ListCitizens() {
  const citizenAddress = useCitizenAddress();
  const { data, isLoading, error } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "read",
  }) as {
    data?: readonly CitizenView[];
    isLoading: boolean;
    error: Error | null;
  };

  if (isLoading) return <p className="p-4">Loading citizens...</p>;
  if (error) return <p className="p-4">Error: {error.message}</p>;

  const citizens = data ?? [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Citizen List</h2>
      {citizens.length === 0 ? (
        <p>No citizens found.</p>
      ) : (
        <ul>
          {citizens.map((c) => (
            <li key={c.id.toString()} className="mb-2">
              {c.wallet} &middot; id: {c.id.toString()} &middot; reason:{" "}
              {c.reasonCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListCitizens;
