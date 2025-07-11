import { useEffect, useState } from "react";

interface Application {
  name: string;
  wallet_address: string;
  origin: string;
  reason: string;
  assets: string;
}

function Applications() {
  const [data, setData] = useState<Application[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/immigrates/applications")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleCreate = async (app: Application) => {
    await fetch("http://localhost:5000/immigrates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(app),
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
    alert("Immigration created");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Immigration Applications
      </h2>
      <ul className="space-y-4">
        {data.map((item, i) => (
          <li
            key={i}
            className="border p-4 rounded bg-gray-50 shadow-sm cursor-pointer"
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <p>
              <span className="font-semibold">name:</span> {item.name}
            </p>
            <p>
              <span className="font-semibold">Wallet:</span>{" "}
              {item.wallet_address}
            </p>
            {selected === i && (
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-semibold">Origin:</span> {item.origin}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span> {item.reason}
                </p>
                <p>
                  <span className="font-semibold">Assets:</span> {item.assets}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreate(item);
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Applications;
