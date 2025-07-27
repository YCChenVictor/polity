import { useReadContract, useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";
import { useState } from "react";

interface GovernanceModuleView {
  name: string;
  moduleAddress: `0x${string}`;
}

function Governance({ govAddress }: { govAddress: `0x${string}` }) {
  const [newAddress, setNewAddress] = useState<`0x${string}`>("0x");
  const {
    data: modules,
    isLoading: readLoading,
    error: readError,
  } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "listGovernanceModules",
  });

  const {
    writeContract,
    isPending,
    error: writeError,
    isSuccess,
  } = useWriteContract();

  const handleSet = () => {
    writeContract({
      address: govAddress,
      abi: polityGovernmentAbi,
      functionName: "setCitizenRegistry",
      args: [newAddress],
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Governance Modules</h2>

      {readLoading && <p>Loading...</p>}
      {readError && <p className="text-red-500">Error loading modules</p>}
      {modules && (
        <ul className="space-y-2">
          {(modules as GovernanceModuleView[])?.map((m, i) => (
            <li key={i}>
              <strong>{m.name}</strong>: {m.moduleAddress}
            </li>
          ))}
        </ul>
      )}

      <div className="pt-4">
        <input
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value as `0x${string}`)}
          placeholder="New CitizenRegistry address"
          className="p-2 border rounded w-full mb-2"
        />
        <button
          onClick={handleSet}
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isPending ? "Setting..." : "Set Citizen Registry"}
        </button>
        {isSuccess && <p className="text-green-500">Set successfully.</p>}
        {writeError && <p className="text-red-500">Transaction failed.</p>}
      </div>
    </div>
  );
}

export default Governance;
