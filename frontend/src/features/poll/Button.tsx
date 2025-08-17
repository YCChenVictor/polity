import { useWriteContract } from "wagmi";
import { pollAbi } from "../../generated";

function Button({
  address,
  id,
  support,
}: {
  address: `0x${string}`;
  id: bigint;
  support: boolean;
}) {
  const { writeContract, isPending, isSuccess, isError, error } =
    useWriteContract();

  const handleVote = () => {
    writeContract({
      address,
      abi: pollAbi,
      functionName: "vote",
      args: [id, support],
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleVote}
        disabled={isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Voting..." : support ? "Vote Yes" : "Vote No"}
      </button>

      {isSuccess && (
        <span className="text-green-600 text-sm">Vote submitted!</span>
      )}
      {isError && (
        <span className="text-red-600 text-sm">
          {error?.message ?? "Something went wrong"}
        </span>
      )}
    </div>
  );
}

export default Button;
