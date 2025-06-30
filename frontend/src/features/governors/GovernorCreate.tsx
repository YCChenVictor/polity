import { useState } from "react";
import { useContractRead, useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../../generated";

interface Proposal {
  proposed: string;
  votes: number;
  executed: boolean;
}

function ProposalList({ address }: { address: `0x${string}` }) {
  const [newGovAddress, setNewGovAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Read proposals
  const {
    data,
    isLoading: readLoading,
    error: readError,
  } = useContractRead({
    address,
    abi: polityGovernmentAbi,
    functionName: "listGovernorProposals",
  });

  // Write transaction
  const { writeContract, isPending, isError, isSuccess, error } =
    useWriteContract();

  if (readLoading) return <p>Loading proposals...</p>;
  if (readError)
    return <p className="text-red-500">Error: {readError.message}</p>;

  const proposals: Proposal[] = [];
  if (data) {
    const [proposedArr, votesArr, executedArr] = data as [
      string[],
      bigint[],
      boolean[],
    ];
    proposedArr.forEach((addr, i) => {
      proposals.push({
        proposed: addr,
        votes: Number(votesArr[i]),
        executed: executedArr[i],
      });
    });
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
          disabled={isPending}
        >
          + Add Governor
        </button>
      </div>

      <ul className="space-y-2">
        {proposals.map((p, i) => (
          <li key={i} className="border rounded-2xl p-3 shadow">
            <span className="font-medium">#{i}</span> – Proposed:{" "}
            <code>{p.proposed}</code>, Votes: {p.votes}, Executed:{" "}
            {p.executed ? "Yes" : "No"}
            <button
              onClick={() => {
                handleClick(i);
              }}
            >
              Click Me
            </button>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Governor</h3>

            {isError && (
              <p className="text-red-500 mb-2">Error: {error?.message}</p>
            )}

            <input
              type="text"
              placeholder="0xAddress"
              value={newGovAddress}
              onChange={(e) => setNewGovAddress(e.target.value)}
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
                onClick={handleAddGovernor}
                disabled={!newGovAddress || isPending}
              >
                {isPending ? "Adding..." : "Add"}
              </button>
            </div>

            {isSuccess && (
              <p className="text-green-500 mt-2">Governor proposed!</p>
            )}
          </div>
        </div>
      )}
    </>
  );

  function handleClick(id: number) {
    writeContract({
      address,
      abi: polityGovernmentAbi,
      functionName: "voteGovernor",
      args: [BigInt(id)],
    });
  }

  function handleAddGovernor() {
    writeContract({
      address,
      abi: polityGovernmentAbi,
      functionName: "proposeGovernor",
      args: [newGovAddress as `0x${string}`],
    });
  }
}

export default ProposalList;
