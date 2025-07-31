import { useEffect, useState } from "react";
import { isGovernor } from "../../contracts/governor"; // custom hook wrapper

interface Contribution {
  title: string;
  content: string;
  validated: string;
}

function ListContributions() {
  const [data, setData] = useState<Contribution[]>([]);
  const { data: isGov } = isGovernor();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/contributions`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleValidate = async (index: number) => {
    const updated = [...data];
    const item = updated[index];
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/contributions/validate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: item.title }),
        },
      );
      if (res.ok) {
        item.validated = "true";
        setData(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
              <span className="font-semibold">Title:</span> {item.title}
            </p>
            <p>
              <span className="font-semibold">Content:</span> {item.content}
            </p>
            <p>
              <span className="font-semibold">Validated:</span>{" "}
              {`${item.validated}`}
            </p>
            {isGov && (
              <button
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                onClick={() => handleValidate(i)}
              >
                Validate
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListContributions;
