import React, { useState } from "react";

export default function UploadEvent() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/events/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      setStatus(`✅ Uploaded! CID: ${data.cid ?? "no cid returned"}`);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
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
