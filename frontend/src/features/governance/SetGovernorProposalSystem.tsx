import { useState } from "react";
import { useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../../generated";

interface SetGovernorProposalSystemProps {
  govAddress: `0x${string}`;
}

const SetGovernorProposalSystem = ({
  govAddress,
}: SetGovernorProposalSystemProps) => {
  const [
    newAddressForGovernorProposalSystem,
    setNewAddressForGovernorProposalSystem,
  ] = useState<`0x${string}`>("0x");

  const {
    writeContract,
    isPending,
    error: writeError,
    isSuccess,
  } = useWriteContract();

  const handleSetGovernorProposalSystem = async () => {
    try {
      await writeContract({
        address: govAddress,
        abi: polityGovernmentAbi,
        functionName: "setGovernorProposalSystem",
        args: [newAddressForGovernorProposalSystem],
      });
    } catch (error) {
      console.error("Error setting GovernorProposalSystem:", error);
    }
  };

  return (
    <div className="pt-4">
      <input
        value={newAddressForGovernorProposalSystem}
        onChange={(e) =>
          setNewAddressForGovernorProposalSystem(
            e.target.value as `0x${string}`,
          )
        }
        placeholder="New GovernorProposalSystem address"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={handleSetGovernorProposalSystem}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Setting..." : "Set Citizen Governor Proposal System"}
      </button>
      {isSuccess && (
        <p className="text-green-500">
          Governor Proposal System set successfully.
        </p>
      )}
      {writeError && <p className="text-red-500">Transaction failed.</p>}
    </div>
  );
};

export default SetGovernorProposalSystem;
