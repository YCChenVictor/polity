import { useEffect, useState } from "react";

interface Contribution {
  wallet_address: string;
  task: string;
  description: string;
}

function ListContributions() {
  const [data, setData] = useState<Contribution[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/contributions`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contributions</h2>
      <ul className="space-y-4">
        {data.map((item, i) => (
          <li
            key={i}
            className="border p-4 rounded bg-gray-50 shadow-sm space-y-1"
          >
            <p>
              <span className="font-semibold">Wallet:</span>{" "}
              {item.wallet_address}
            </p>
            <p>
              <span className="font-semibold">Task:</span> {item.task}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListContributions;
