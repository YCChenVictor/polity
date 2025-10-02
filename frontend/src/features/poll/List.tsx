import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";

import VoteButton from "./VoteButton";
// import FinalizeButton from "./FinalizeButton";

import { agoraAbi } from "../../generated";

// interface PollView {
//   id: bigint;
//   content: string;
//   yes: number;
//   no: number;
//   deadlineAt: string;
// }

type Votes = readonly [bigint, bigint, bigint];

function List({ agoraAddress }: { agoraAddress: `0x${string}` }) {
  // ---- hooks first
  const { data, isLoading, error, refetch } = useReadContract({
    address: agoraAddress,
    abi: agoraAbi,
    functionName: "proposals",
    args: [0n, 10n],
  });

  const agoras =
    (data as
      | readonly {
          id: bigint;
          kind: number;
          proposer: `0x${string}`;
          startBlock: bigint;
          endBlock: bigint;
        }[]
      | undefined) ?? [];

  const contracts = useMemo(
    () =>
      agoras.map((a) => ({
        address: agoraAddress as `0x${string}`,
        abi: agoraAbi,
        functionName: "proposalVotes",
        args: [a.id as bigint],
      })),
    [agoraAddress, agoras],
  );

  const votesReads = useReadContracts({ contracts });

  // cast once to avoid huge generic explosions
  const votesData = votesReads.data as
    | readonly { result?: Votes }[]
    | undefined;

  const getVotes = (data: typeof votesData, i: number): Votes =>
    data?.[i]?.result ?? ([0n, 0n, 0n] as const);

  // ---- branch AFTER hooks
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {agoras.map((a, i) => {
        const [against, yes, abstain] = getVotes(votesData, i);
        return (
          <li key={a.id.toString()} className="border p-2 my-2 rounded">
            <strong>{a.id.toString()}</strong>
            <div>
              ✅ {yes.toString()} ❌ {against.toString()} 🤷{" "}
              {abstain.toString()}
              <VoteButton
                address={agoraAddress}
                id={a.id}
                support={1}
                onVoted={() => refetch()}
              />
              ❌ {against.toString()}
              <VoteButton
                address={agoraAddress}
                id={a.id}
                support={0}
                onVoted={() => refetch()}
              />
              🤷 {abstain.toString()}
              <VoteButton
                address={agoraAddress}
                id={a.id}
                support={2}
                onVoted={() => refetch()}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default List;
