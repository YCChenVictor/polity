import { useState } from "react";
import { useWriteContract } from "wagmi";
import { governmentAbi } from "../../generated";

interface SetVotingMechanismProps {
  governmentAddress: `0x${string}`;
}

const SetVotingMechanism = ({ governmentAddress }: SetVotingMechanismProps) => {
  const [newAddressForVotingMechanism, setNewAddressForVotingMechanism] =
    useState<`0x${string}`>("0x");

  const {
    writeContract,
    isPending,
    error: writeError,
    isSuccess,
  } = useWriteContract();

  const handleSetVotingMechanism = async () => {
    try {
      await writeContract({
        address: governmentAddress,
        abi: governmentAbi,
        functionName: "setModule",
        args: ["poll", newAddressForVotingMechanism],
      });
    } catch (error) {
      console.error("Error setting governance modules:", error);
    }
  };

  return (
    <div className="pt-4">
      <input
        value={newAddressForVotingMechanism}
        onChange={(e) =>
          setNewAddressForVotingMechanism(e.target.value as `0x${string}`)
        }
        placeholder="New VotingMechanism address"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={handleSetVotingMechanism}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Setting..." : "Set Poll Mechanism"}
      </button>
      {isSuccess && (
        <p className="text-green-500">Poll Mechanism set successfully.</p>
      )}
      {writeError && <p className="text-red-500">Transaction failed.</p>}
    </div>
  );
};

export default SetVotingMechanism;
