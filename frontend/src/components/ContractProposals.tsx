import { useState } from "react";
import { useContractRead, useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";

interface Proposal {
  proposed: string;
  votes: bigint;
}

function ContractProposals({ address }: { address: `0x${string}` }) {
  const [newRuleAddress, setNewRuleAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { writeContract, isPending, isError, isSuccess, error } =
    useWriteContract();

  const {
    data,
    isLoading: readLoading,
    error: readError,
  } = useContractRead({
    address,
    abi: polityGovernmentAbi,
    functionName: "listRuleProposals",
  });

  if (readLoading) return <p>Loading proposals...</p>;
  if (readError)
    return <p className="text-red-500">Error: {readError.message}</p>;

  let proposals: Proposal[] = [];

  if (Array.isArray(data)) {
    proposals = data as Proposal[];
  }

  return (
    <>
      <h2>contract proposals</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
          disabled={isPending}
        >
          + Add Rule
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Rule</h3>

            {isError && (
              <p className="text-red-500 mb-2">Error: {error?.message}</p>
            )}

            <input
              type="text"
              placeholder="0xAddress"
              value={newRuleAddress}
              onChange={(e) => setNewRuleAddress(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              disabled={isPending}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700"
                onClick={handleAddRule}
                disabled={!newRuleAddress || isPending}
              >
                {isPending ? "Adding..." : "Add"}
              </button>
            </div>

            {isSuccess && <p className="text-green-500 mt-2">Rule proposed!</p>}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Proposals</h3>
        {proposals.length === 0 ? (
          <p className="text-gray-500">No proposals yet.</p>
        ) : (
          <ul>
            {proposals.map((p, i) => (
              <li key={p.proposed}>
                {i}. {p.proposed} – Votes: {p.votes.toString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  function handleAddRule() {
    writeContract({
      address,
      abi: polityGovernmentAbi,
      functionName: "proposeRule",
      args: [newRuleAddress as `0x${string}`],
    });
  }
}

export default ContractProposals;
