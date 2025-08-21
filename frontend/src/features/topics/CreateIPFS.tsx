import React, { useState } from "react";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";
import { create as createIpfs } from "ipfs-http-client";

const IPFS_API_URL =
  process.env.NEXT_PUBLIC_IPFS_API_URL ?? "http://localhost:5001/api/v0";
const TOPICS_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_TOPICS_ADDRESS as `0x${string}`;
const TOPICS_ABI = [
  {
    type: "function",
    name: "createTopic",
    stateMutability: "nonpayable",
    inputs: [
      { name: "topicCid", type: "string" },
      { name: "title", type: "string" },
    ],
    outputs: [],
  },
] as const;

export default function TopicCreateForm() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const ipfs = createIpfs({ url: IPFS_API_URL });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !walletClient) return;

    const payload = { title, body, proposer: address, createdAt: Date.now() };
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    const { cid } = await ipfs.add(bytes);

    await writeContractAsync({
      abi: TOPICS_ABI,
      address: TOPICS_CONTRACT_ADDRESS,
      functionName: "createTopic",
      args: [cid.toString(), title],
    });

    setTitle("");
    setBody("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Topic Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Topic body..."
        rows={5}
      />
      <button type="submit" disabled={!title || !body}>
        Publish Topic
      </button>
    </form>
  );
}
