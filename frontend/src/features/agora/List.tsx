import { useMemo, useState } from "react";
import { useReadContract, useReadContracts, usePublicClient } from "wagmi";

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
  const publicClient = usePublicClient();
  const [thresholds, setThresholds] = useState<
    Record<string, bigint | "ns" | "err">
  >({});
  const [loading] = useState<Record<string, boolean>>({});

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

  const votes = useMemo(
    () =>
      agoras.map((a) => ({
        address: agoraAddress as `0x${string}`,
        abi: agoraAbi,
        functionName: "proposalVotes",
        args: [a.id as bigint],
      })),
    [agoraAddress, agoras],
  );

  const votesReads = useReadContracts({ contracts: votes });

  // cast once to avoid huge generic explosions
  const votesData = votesReads.data as
    | readonly { result?: Votes }[]
    | undefined;

  const getVotes = (data: typeof votesData, i: number): Votes =>
    data?.[i]?.result ?? ([0n, 0n, 0n] as const);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  async function handleLoadThreshold(id: bigint) {
    if (!publicClient) return;
    const res = await publicClient.readContract({
      address: agoraAddress,
      abi: agoraAbi,
      functionName: "votesThresholdOf",
      args: [id],
    });
    setThresholds((p) => ({ ...p, [id.toString()]: res as bigint }));
  }

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
            <div className="mt-2">
              {thresholds[a.id.toString()] ? (
                thresholds[a.id.toString()] === "ns" ? (
                  <span className="opacity-70">Threshold: not started</span>
                ) : thresholds[a.id.toString()] === "err" ? (
                  <span className="text-red-600">Threshold: error</span>
                ) : (
                  <span>
                    Threshold: {thresholds[a.id.toString()].toString()}
                  </span>
                )
              ) : (
                <button
                  onClick={() => handleLoadThreshold(a.id)}
                  disabled={loading[a.id.toString()]}
                  className="mt-1 border rounded px-2 py-1"
                >
                  {loading[a.id.toString()] ? "Loading…" : "Show threshold"}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default List;
