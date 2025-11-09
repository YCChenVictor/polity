import { useState } from "react";
import { useAccount } from "wagmi";

export default function UploadEvent() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const { address } = useAccount();

  const handleUpload = async () => {
    if (!file) return;
    if (!address) return setStatus("❌ Wallet not connected");

    setStatus("Uploading...");

    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("proposer", address);

      const res = await fetch("/api/ipfs/file", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());

      const data: { cid: string; gateway: string } = await res.json();
      console.log(data);
      setStatus(`✅ Uploaded: ${data.cid}`);
    } catch (err: any) {
      console.log(err);
      setStatus(`❌ Error: ${err.message ?? String(err)}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-3">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        Upload
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
