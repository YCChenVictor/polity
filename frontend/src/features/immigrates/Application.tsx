import { useState } from "react";
import { isAddress, type Hash } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { citizenAbi } from "../../generated";
import Init from "../poll/Init";

interface ApplicationData {
  name: string;
  wallet_address: string;
}

export default function Application({
  citizenAddress,
}: {
  citizenAddress: `0x${string}`;
}) {
  const [newApp, setNewApp] = useState<ApplicationData>({
    name: "",
    wallet_address: "",
  });
  const { writeContractAsync } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hash, setHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { data: poll } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "poll",
  });

  const { isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleCreate = async () => {
    if (!isAddress(citizenAddress)) return setError("Bad contract address.");
    if (!isAddress(newApp.wallet_address))
      return setError("Invalid wallet address.");
    try {
      const txHash = await writeContractAsync({
        address: citizenAddress,
        abi: citizenAbi,
        functionName: "propose",
        args: [newApp.wallet_address],
      });
      setHash(txHash);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewApp((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (isConfirmed && isModalOpen) setIsModalOpen(false);

  return (
    <div className="p-4">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-6 mb-3 border-b pb-2">
        Immigration system
      </h2>

      {poll && poll !== "0x0000000000000000000000000000000000000000" ? (
        <button
          onClick={() => {
            setIsModalOpen(true);
            setHash(undefined);
            setError(null);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Application
        </button>
      ) : (
        <Init citizenAddress={citizenAddress} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500/75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Create New Application
            </h3>

            {error && <p className="mb-3 text-red-600 text-sm">{error}</p>}
            {hash && (
              <p className="mb-3 text-sm break-all">
                Tx: <span className="font-mono">{hash}</span>{" "}
                {isConfirming
                  ? "…confirming"
                  : isConfirmed
                    ? "✓ confirmed"
                    : ""}
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <label className="block mb-3">
                <span className="font-semibold">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={newApp.name}
                  onChange={onChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>

              <label className="block mb-3">
                <span className="font-semibold">Wallet Address:</span>
                <input
                  type="text"
                  name="wallet_address"
                  value={newApp.wallet_address}
                  onChange={onChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </label>

              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending
                    ? "Sending…"
                    : isConfirming
                      ? "Confirming…"
                      : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
