import React, { useEffect, useState } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";

import { postJSON } from "../../api"
import { agoraAbi, citizenRegistryAbi } from "../../generated";
import { useCitizenAddress } from "../../CitizenAddressContext";

interface IPFSFile {
  name: string;
  type: string;
  size: number;
  cid: string;
}

const IPFSFileList: React.FC = () => {
  const { address } = useAccount();

  const citizenAddress = useCitizenAddress();
  const { writeContract, isPending } = useWriteContract();

  const [files, setFiles] = useState<IPFSFile[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: agoraAddress } = useReadContract({
    address: citizenAddress,
    abi: citizenRegistryAbi,
    functionName: "agoraAddress",
  });

  const onClickRaiseVote = async (cid: string) => {
    if (!agoraAddress) {
      console.error("Poll not set");
      return;
    }
    if (!address) {
      console.error("No current account");
      return;
    }

    try {
      writeContract({
        address: agoraAddress,
        abi: agoraAbi,
        functionName: "createIPFS",
        args: [address, cid],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onClickCheckCompliance = async (cid: string) => {
    try {
      const r = await postJSON(
        "/judges",
        {
          contentFile: "constitution.md",
          ruleFile: "constitution.md",
        },
        undefined,
      );
      console.log(r)
    } catch (e) {
      console.error(e);
      // TODO: surface error UI
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/events/")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 rounded-xl shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Size</th>
            <th className="px-4 py-2 text-left">CID</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 &&
            files.map((f) => (
              <tr key={f.cid} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{f.name}</td>
                <td className="px-4 py-2">{f.type}</td>
                <td className="px-4 py-2">{f.size} bytes</td>
                <td className="px-4 py-2">
                  <a
                    href={`https://ipfs.io/ipfs/${f.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {f.cid}
                  </a>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onClickCheckCompliance(f.cid)}
                    disabled={isPending}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Check Compliance
                  </button>
                  <button
                    onClick={() => onClickRaiseVote(f.cid)}
                    disabled={isPending}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Raise Vote
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default IPFSFileList;
