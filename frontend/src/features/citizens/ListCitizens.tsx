import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../../generated";

interface Citizen {
  wallet: `0x${string}`;
}

function ListCitizens({ govAddress }: { govAddress: `0x${string}` }) {
  const [citizens, setCitizens] = useState<Citizen[]>([]);

  const {
    data: citizensInContract,
    isLoading: readLoading,
    error: readError,
  } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "getCitizens",
  });

  useEffect(() => {
    if (citizensInContract) {
      setCitizens([...citizensInContract]);
    }
  }, [citizensInContract]);

  if (readLoading) {
    return <p>Loading citizens...</p>;
  }

  if (readError) {
    return <p>Error loading citizens: {readError.message}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Citizen List</h2>
      <ul>
        {citizens.map((c, i) => (
          <li key={i} className="mb-2">
            {c.wallet},
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListCitizens;
