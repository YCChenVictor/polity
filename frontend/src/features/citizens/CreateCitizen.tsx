import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../../generated";

interface CitizenData {
  name: string;
  reason: number;
}

const REASON_OPTIONS: Record<number, string> = {
  1: "born",
  2: "immigrate",
};

function CreateCitizen({ govAddress }: { govAddress: `0x${string}` }) {
  const [citizenAddress, setCitizenAddress] = useState<string>("");
  const [formData, setFormData] = useState<CitizenData>({
    name: "",
    reason: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { writeContract, isPending, isError, isSuccess, error } =
    useWriteContract();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "reason" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating citizen:", { ...formData, citizenAddress });

    await writeContract({
      address: govAddress,
      abi: polityGovernmentAbi,
      functionName: "createCitizen",
      args: [citizenAddress as `0x${string}`, formData.reason],
    });

    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex mt-10">
      <button
        onClick={toggleModal}
        className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600 transition duration-300"
      >
        Create Citizen
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Create a Citizen
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="citizenAddress"
                  className="block text-lg font-medium"
                >
                  Citizen Address
                </label>
                <input
                  type="text"
                  id="citizenAddress"
                  name="citizenAddress"
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reason" className="block text-lg font-medium">
                  Reason
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select reason</option>
                  {Object.entries(REASON_OPTIONS).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {isError && (
                <p className="text-red-500 mb-2">Error: {error?.message}</p>
              )}
              {isSuccess && (
                <p className="text-green-600 mb-2">Citizen submitted!</p>
              )}

              <div className="flex justify-between">
                <button
                  type="submit"
                  disabled={isPending || !citizenAddress}
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateCitizen;
