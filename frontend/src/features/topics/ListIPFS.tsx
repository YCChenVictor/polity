import React, { useEffect, useState } from "react";

interface IPFSFile {
  name: string;
  type: string;
  size: number;
  cid: string;
}

const IPFSFileList: React.FC = () => {
  const [files, setFiles] = useState<IPFSFile[]>([]);
  const [loading, setLoading] = useState(true);

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
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IPFSFileList;
