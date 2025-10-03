import { useReadContract } from "wagmi";

// import VoteButton from "./VoteButton";
// import FinalizeButton from "./FinalizeButton";

import { agoraAbi } from "../../generated";

// interface PollView {
//   id: bigint;
//   content: string;
//   yes: number;
//   no: number;
//   deadlineAt: string;
// }

function List({ pollAddress }: { pollAddress: `0x${string}` }) {
  const {
    data: polls,
    isLoading,
    error,
  } = useReadContract({
    address: pollAddress,
    abi: agoraAbi,
    functionName: "proposals",
    args: [0n, 10n], // offset 0, limit 10, use BigInt
  }) as {
    data?: readonly {
      id: bigint;
      kind: number;
      proposer: `0x${string}`;
      startBlock: bigint;
      endBlock: bigint;
    }[];
    isLoading: boolean;
    error: Error | null;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!polls || polls.length === 0) return <div>No polls found</div>;

  return (
    <ul>
      {polls.map((poll) => {
        // const deadline = Number(poll.deadlineAt) * 1000; // to ms if needed
        // const now = Date.now();
        // const isPastDeadline = now > deadline;

        return (
          <li key={poll.id} className="border p-2 my-2 rounded">
            <p>
              <strong>{poll.id}</strong>
            </p>
            {/* <p>
              ✅ Yes: {poll.yes}{" "}
              <VoteButton address={pollAddress} id={poll.id} support={true} />
            </p>
            <p>
              ❌ No: {poll.no}{" "}
              <VoteButton address={pollAddress} id={poll.id} support={false} />
            </p>
            <p>Deadline: {new Date(deadline).toLocaleString()}</p>

            {isPastDeadline && (
              <FinalizeButton address={pollAddress} id={poll.id} />
            )} */}
          </li>
        );
      })}
      {/* {polls.map((poll) => {
        const deadline = Number(poll.deadlineAt) * 1000; // to ms if needed
        const now = Date.now();
        const isPastDeadline = now > deadline;

        return (
          <li key={poll.id} className="border p-2 my-2 rounded">
            <p>
              <strong>{poll.content}</strong>
            </p>
            <p>
              ✅ Yes: {poll.yes}{" "}
              <VoteButton address={pollAddress} id={poll.id} support={true} />
            </p>
            <p>
              ❌ No: {poll.no}{" "}
              <VoteButton address={pollAddress} id={poll.id} support={false} />
            </p>
            <p>Deadline: {new Date(deadline).toLocaleString()}</p>

            {isPastDeadline && (
              <FinalizeButton address={pollAddress} id={poll.id} />
            )}
          </li>
        );
      })} */}
    </ul>
  );
}

export default List;
