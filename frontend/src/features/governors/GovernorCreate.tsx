import { useState } from "react";
import { useReadContracts } from "wagmi";
// import { polityGovernmentAbi } from "../../generated";

function CreateGovernor() {
  // { address }: { address: `0x${string}` }
  const [newGovAddress, setNewGovAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    // data,
    isLoading,
    error: readError,
  } = useReadContracts({
    contracts: [
      // {
      //   address,
      //   abi: polityGovernmentAbi,
      //   functionName: "readCitizens",
      // },
      // {
      //   address,
      //   abi: polityGovernmentAbi,
      //   functionName: "listGovernorProposals",
      // },
      // {
      //   address,
      //   abi: polityGovernmentAbi,
      //   functionName: "getRequiredSignatures",
      // },
    ],
  });

  // const {
  //   writeContract,
  //   isPending,
  //   isError,
  //   isSuccess,
  //   error: writeError,
  // } = useWriteContract();

  // const citizens = data?.[0]?.result;
  // const proposals = data?.[1]?.result;
  // const signatureThreshold = data?.[2]?.result;

  if (isLoading) {
    return <p>Loading governors...</p>;
  }

  if (readError) {
    return <p className="text-red-500">Read Error: {readError.message}</p>;
  }

  return (
    <>
      <>Passing Threshold: Votes</>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
          // disabled={isPending}
        >
          + Add Governor
        </button>
      </div>
      <ul className="space-y-4">
        {[].map((p, i) => (
          <li
            key={i}
            className="border rounded-2xl p-4 shadow hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* <div className="text-sm text-gray-800">
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
              </div> */}
              <button
                onClick={() => handleVote()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Vote It
              </button>
            </div>
          </li>
        ))}
      </ul>
      (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Add Governor</h3>

          <p className="text-red-500 mb-2">Error: {}</p>

          <input
            type="text"
            placeholder="0xAddress"
            value={newGovAddress}
            onChange={(e) => setNewGovAddress(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            disabled={true}
          />

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400"
              onClick={() => setModalOpen(false)}
              disabled={true}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700"
              onClick={handleAddGovernor}
              disabled={!newGovAddress || true}
            >
              {modalOpen ? "Adding..." : "Add"}
            </button>
          </div>

          <p className="text-green-500 mt-2">Governor proposed!</p>
        </div>
      </div>
      )
    </>
  );

  function handleVote() {
    // writeContract({
    //   address,
    //   abi: polityGovernmentAbi,
    //   functionName: "voteGovernor",
    //   args: [BigInt(id)],
    // });
  }

  function handleAddGovernor() {
    // writeContract({
    //   address,
    //   abi: polityGovernmentAbi,
    //   functionName: "proposeGovernor",
    //   args: [newGovAddress as `0x${string}`],
    // });
  }
}

export default CreateGovernor;
