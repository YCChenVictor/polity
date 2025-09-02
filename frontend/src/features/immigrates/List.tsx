import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
// import { polityGovernmentAbi } from "../../generated";

interface Immigrate {
  name: string;
  wallet_address: `0x${string}`;
}

function ListImmigrates() {
  // { govAddress }: { govAddress: `0x${string}` }
  const [data, setData] = useState<Immigrate[]>([]);
  const { isPending } = useWriteContract();

  useEffect(() => {
    fetch("http://localhost:5000/immigrates")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleCreate = async () =>
    // wallet: `0x${string}`, reason: number
    {
      try {
        // await writeContractAsync({
        //   address: govAddress,
        //   abi: polityGovernmentAbi,
        //   functionName: "createCitizen",
        //   args: [wallet, reason],
        // });
        alert("Created as citizen");
      } catch (err) {
        console.error(err);
        alert("Failed");
      }
    };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Immigration List
      </h2>
      <ul className="space-y-4">
        {data.map((item, i) => (
          <li key={i} className="p-4 border rounded shadow">
            <p className="font-semibold">Name: {item.name}</p>
            <p className="text-sm text-gray-600 break-all">
              Wallet: {item.wallet_address}
            </p>
            <button
              disabled={isPending}
              onClick={() => handleCreate()}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            >
              {isPending ? "Submitting..." : "Create as Citizen"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListImmigrates;
