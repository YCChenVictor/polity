import { useReadContract } from "wagmi";

import Button from "./Button";

import { pollAbi } from "../../generated";

interface PollView {
  id: bigint;
  content: string;
  yes: number;
  no: number;
}

function List({ address }: { address: `0x${string}` }) {
  const { data, isLoading, error } = useReadContract({
    address,
    abi: pollAbi,
    functionName: "list",
  }) as {
    data?: readonly PollView[];
    isLoading: boolean;
    error: Error | null;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No polls found</div>;

  return (
    <ul>
      {data.map((poll) => (
        <li key={poll.id} className="border p-2 my-2 rounded">
          <p>
            <strong>{poll.content}</strong>
          </p>
          <p>
            ✅ Yes: {poll.yes}{" "}
            <Button address={address} id={poll.id} support={true} />
          </p>
          <p>
            ❌ No: {poll.no}{" "}
            <Button address={address} id={poll.id} support={false} />
          </p>
        </li>
      ))}
    </ul>
  );
}
export default List;
