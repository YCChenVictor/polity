import { useWriteContract, useTransactionReceipt } from "wagmi";

import { agoraAbi } from "../../generated";

type Support = 0 | 1 | 2;

export default function VoteButton({
  address,
  id,
  support,
  reason,
  onVoted,
}: {
  address: `0x${string}`;
  id: bigint;
  support: Support; // 0 no, 1 yes, 2 abstain
  reason?: string;
  onVoted?: () => void; // e.g. refetch votes
}) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useTransactionReceipt({ hash });

  const click = () =>
    writeContract({
      address,
      abi: agoraAbi,
      functionName: reason ? "castVoteWithReason" : "castVote",
      args: reason ? [id, support, reason] : [id, support],
    });

  if (isSuccess && onVoted) onVoted();

  const label =
    support === 1 ? "👍 Yes" : support === 0 ? "👎 No" : "🤷 Abstain";

  return (
    <button
      className="px-3 py-1 rounded-xl border disabled:opacity-50"
      onClick={click}
      disabled={isPending || waiting}
      title={reason}
    >
      {isPending || waiting ? "Voting…" : label}
      {error ? <span className="ml-2 text-red-600">Failed</span> : null}
    </button>
  );
}
