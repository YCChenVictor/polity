import { useState } from "react";
import { useWriteContract } from "wagmi";
import { governmentAbi } from "../../generated";

interface SetCitizenRegistryProps {
  governmentAddress: `0x${string}`;
}

const SetCitizenRegistry = ({ governmentAddress }: SetCitizenRegistryProps) => {
  const [newAddressForCitizenRegistry, setNewAddressForCitizenRegistry] =
    useState<`0x${string}`>("0x");

  const {
    writeContract,
    isPending,
    error: writeError,
    isSuccess,
  } = useWriteContract();

  const handleSetCitizen = async () => {
    try {
      await writeContract({
        address: governmentAddress,
        abi: governmentAbi,
        functionName: "setModule",
        args: ["citizen", newAddressForCitizenRegistry],
      });
    } catch (error) {
      console.error("Error setting CitizenRegistry:", error);
    }
  };

  return (
    <div className="pt-4">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-6 mb-3 border-b border-gray-200 pb-2">
        Governance Modules
      </h2>
      <input
        value={newAddressForCitizenRegistry}
        onChange={(e) =>
          setNewAddressForCitizenRegistry(e.target.value as `0x${string}`)
        }
        placeholder="New CitizenRegistry address"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={handleSetCitizen}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Setting..." : "Set Citizen Mechanism"}
      </button>
      {isSuccess && (
        <p className="text-green-500">Citizen Registry set successfully.</p>
      )}
      {writeError && <p className="text-red-500">Transaction failed.</p>}
    </div>
  );
};

export default SetCitizenRegistry;
