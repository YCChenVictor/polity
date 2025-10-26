import { useState } from "react";

function Constitution() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [res, setRes] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setFileName(f.name);
    setRes(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dir", "/staging");

    try {
      const r = await fetch("http://localhost:5000/events/", {
        method: "POST",
        body: formData,
      });
      const json = await r.json().catch(() => ({}));
      setRes(json);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Upload Initial Constitution</h2>
      <p className="text-sm text-gray-500">
        Choose your Markdown constitution file, then click <b>Upload</b> to send
        it to your backend (<code>/events/</code>).
      </p>

      <input
        type="file"
        accept=".md,text/markdown"
        className="block w-full text-sm border p-2 rounded"
        onChange={handleSelect}
      />

      {fileName && (
        <p className="text-sm text-gray-600">Selected: {fileName}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {res && (
        <div className="text-sm mt-3 border-t pt-3">
          <p>
            <b>Response:</b>
          </p>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(res, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Constitution;
