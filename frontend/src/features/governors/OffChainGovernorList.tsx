import React, { useEffect, useState } from "react";

interface Legislator {
  name: string;
  // add other properties if needed
}

function OffChainGovernorList() {
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [selected, setSelected] = useState<Legislator | null>(null);
  const [detail, setDetail] = useState<null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/legislators`) // should extract to backend with fixed values
      .then((res) => res.json())
      .then((data) => setLegislators(data.dataList))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!selected) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/bills`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .catch((err) => console.error("Detail fetch error:", err));
  }, [selected]);

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-2">Off Chain Governors</h2>
        <ul className="list-disc pl-5">
          {legislators.map((legislator, i) => (
            <li key={i} className="mb-1">
              {legislator.name}{" "}
              <button
                onClick={() => setSelected(legislator)}
                className="text-sm text-blue-600 underline"
              >
                View Detail
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">{selected.name}</h3>
            <p>Party: {selected.name}</p>
            <p>District: {selected.name}</p>
            <p>Committee: {selected.name || "—"}</p>
            <button
              onClick={() => {
                setSelected(null);
                setDetail(null);
              }}
              className="mt-4 bg-gray-200 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OffChainGovernorList;
