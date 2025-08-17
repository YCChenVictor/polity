// import { useState } from "react";
// import { useReadContracts, useWriteContract } from "wagmi";
// import { polityGovernmentAbi } from "../generated";

// // interface RuleProposalView {
// //   proposed: `0x${string}`;
// //   votes: bigint;
// //   executed: boolean;
// }

// interface OffChainRuleProposalView {
//   proposed: `0x${string}`;
//   billNumber: string;
//   billId: string;
//   votes: bigint;
//   updateTimestamp: bigint;
// }

function RuleProposals() {
  // {
  //   // governmentAddress,
  // }: {
  //   governmentAddress: `0x${string}`;
  // },
  // const [newRuleAddress, setNewRuleAddress] = useState("");
  // const [modalOpen, setModalOpen] = useState(false);
  // const [voteInProgress, setVoteInProgress] = useState(false); // Track vote status
  // const [, setShowRule] = useState(false); // New state to hold selected rule data

  // const { writeContract, isPending, isError, isSuccess, error } =
  //   useWriteContract();

  // const {
  //   data,
  //   isLoading: readLoading,
  //   error: readError,
  // } = useReadContracts({
  //   contracts: [
  //     {
  //       address: governmentAddress,
  //       abi: polityGovernmentAbi,
  //       functionName: "listProposalsFromCode",
  //     },
  //     {
  //       address: governmentAddress,
  //       abi: polityGovernmentAbi,
  //       functionName: "listProposalsFromBill",
  //     },
  //   ],
  // });

  // if (readLoading) return <p>Loading proposals...</p>;
  // if (readError)
  //   return <p className="text-red-500">Error: {readError.message}</p>;

  // const [codeProposals = [], billProposals = []] =
  //   (data?.map((d) => d.result) as [
  //     RuleProposalView[],
  //     OffChainRuleProposalView[],
  //   ]) || [];

  // const handleView = () => {
  //   setShowRule(true);
  // };

  // const handleVoteOnCodeContract = async (id: number) => {
  //   console.log("zxcv");
  //   setVoteInProgress(true);
  //   try {
  //     // await writeContract({
  //     //   address: governmentAddress,
  //     //   abi: polityGovernmentAbi,
  //     //   functionName: "voteRuleFromCode",
  //     //   args: [BigInt(id)],
  //     // });
  //     console.log(`Voted on rule #${id}`);
  //   } catch (error) {
  //     console.error("Error voting:", error);
  //   } finally {
  //     setVoteInProgress(false);
  //   }
  // };

  // const handleVoteOnBillContract = async (id: number) => {
  //   console.log("zxcv");
  //   setVoteInProgress(true);
  //   try {
  //     // await writeContract({
  //     //   address: governmentAddress,
  //     //   abi: polityGovernmentAbi,
  //     //   functionName: "voteRuleFromBill",
  //     //   args: [BigInt(id)],
  //     // });
  //     console.log(`Voted on rule #${id}`);
  //   } catch (error) {
  //     console.error("Error voting:", error);
  //   } finally {
  //     setVoteInProgress(false);
  //   }
  // };

  return (
    <>
      <div>
        <h3>Proposals</h3>
        <ul>
          {/* {billProposals &&
            billProposals.map((p, i) => (
              <li key={i}>
                <div>Id: {p.billNumber}</div>
                <div>
                  <strong>Proposed :</strong> {p.proposed}
                </div>
                <div>
                  <strong>Bill ID:</strong> {p.billId}
                </div>
                <div>
                  <strong>Votes</strong> {p.votes}
                </div>
                <button
                  onClick={() => handleVoteOnBillContract(i)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Vote It
                </button>
              </li>
            ))} */}
        </ul>
      </div>
      <div className="flex justify-between items-center mb-4">
        {/* <button
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
          disabled={isPending}
        >
          + Add Smart Contract Proposal
        </button> */}
      </div>

      {true && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Rule</h3>

            {/* {isError && (
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

            {isSuccess && <p className="text-green-500 mt-2">Rule proposed!</p>} */}
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {/* {codeProposals &&
          codeProposals.map((p, i) => (
            <li
              key={i}
              className="border rounded-2xl p-4 shadow hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">#{i}</span> &bull; Proposed:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    {p.proposed}
                  </code>{" "}
                  &bull; Votes: {p.votes} &bull; Executed:{" "}
                  <span
                    className={p.executed ? "text-green-600" : "text-red-600"}
                  >
                    {p.executed ? "Yes" : "No"}
                  </span>
                </div>
                <button
                  onClick={() => handleView()} // Pass selected rule data
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleVoteOnCodeContract(i)} // Vote on rule
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={voteInProgress} // Disable while voting is in progress
                >
                  {voteInProgress ? "Voting..." : "Vote It"}
                </button>
              </div>
            </li>
          ))} */}
      </ul>
    </>
  );

  // async function handleAddRule() {
  //   try {
  //     // await writeContract({
  //     //   address: governmentAddress,
  //     //   abi: polityGovernmentAbi,
  //     //   functionName: "proposeRule",
  //     //   args: [newRuleAddress as `0x${string}`],
  //     // });
  //     console.log("Transaction sent. Waiting for confirmation...");
  //   } catch (err) {
  //     console.error("Error proposing rule:", err);
  //   }
  // }
}

export default RuleProposals;
