import { useWriteContract } from "wagmi";
import { pollAbi } from "../../generated";

function FinalizeButton({
  address,
  id,
}: {
  address: `0x${string}`;
  id: bigint;
}) {
  const { writeContract, isPending, isSuccess, isError, error } =
    useWriteContract();

  const handle = () => {
    writeContract({
      address,
      abi: pollAbi,
      functionName: "finalize",
      args: [id],
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handle}
        disabled={isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Finalizing..." : "Finalize Vote"}
      </button>

      {isSuccess && (
        <span className="text-green-600 text-sm">Finalize submitted!</span>
      )}
      {isError && (
        <span className="text-red-600 text-sm">
          {error?.message ?? "Something went wrong"}
        </span>
      )}
    </div>
  );
}

export default FinalizeButton;
