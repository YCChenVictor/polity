import React, { useEffect, useState } from "react";

interface Legislator {
  name: string;
  // add other properties if needed
}

function OffChainGovernorList() {
  const [legislators, setLegislators] = useState<Legislator[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/legislators`) // should extract to backend with fixed values
      .then((res) => res.json())
      .then((data) => setLegislators(data.dataList))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-2">Off Chain Governors</h2>
        <ul className="list-disc pl-5">
          {legislators?.map((legislator, i) => (
            <li key={i} className="mb-1">
              {legislator.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default OffChainGovernorList;
