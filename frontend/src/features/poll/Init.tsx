// wagmi v2 example
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { isAddress } from "viem";
import { useState } from "react";
import { citizenAbi } from "../../generated";

function Init({ citizenAddress }: { citizenAddress: `0x${string}` }) {
  const [, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { address } = useAccount();

  const { data: poll } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "poll",
  });
  const { data: bootstrapOwner } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "bootstrapOwner",
  });

  const { writeContractAsync } = useWriteContract();

  const [addr, setAddr] = useState("");
  const show =
    poll === "0x0000000000000000000000000000000000000000" &&
    address?.toLowerCase() === bootstrapOwner?.toLowerCase();

  console.log(citizenAddress);
  console.log(poll);
  console.log(address);
  console.log(bootstrapOwner);

  if (!show) return null;

  async function onSet() {
    if (!isAddress(addr)) return alert("Invalid address");
    try {
      const hash = await writeContractAsync({
        address: citizenAddress,
        abi: citizenAbi,
        functionName: "setPoll",
        args: [addr as `0x${string}`],
      });
      setTxHash(hash);
    } catch (e) {
      console.error(e);
      alert("tx failed");
    }
  }

  return (
    <div className="p-3 border rounded bg-yellow-50">
      <b>Bootstrap:</b> Set initial Poll contract
      <div className="mt-2 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="0xPollAddress"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
        />
        <button onClick={onSet} className="px-3 py-2 border rounded">
          Set
        </button>
      </div>
      <small>Only visible to bootstrapOwner; disappears after set.</small>
    </div>
  );
}

export default Init;
