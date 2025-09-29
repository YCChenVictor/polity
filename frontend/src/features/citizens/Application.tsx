import { useState } from "react";
import { isAddress, type Hash } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useReadContract } from "wagmi";

import { citizenAbi } from "../../generated";

import { useCitizenAddress } from "../../CitizenAddressContext";

interface ApplicationData {
  name: string;
  wallet_address: string;
}

export default function Application() {
  const citizenAddress = useCitizenAddress();
  const { data: pollAddress } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "pollAddress",
  });
  const [newApp, setNewApp] = useState<ApplicationData>({
    name: "",
    wallet_address: "",
  });
  const { writeContractAsync } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hash, setHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleCreate = async () => {
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
      {pollAddress &&
      pollAddress !== "0x0000000000000000000000000000000000000000" ? (
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
        <div className="text-gray-500 text-sm">Poll address not set</div>
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
