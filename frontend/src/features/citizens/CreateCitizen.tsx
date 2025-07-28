import React, { useState } from "react";

// Citizen data interface
interface CitizenData {
  name: string;
  age: number;
  address: string;
}

const CreateCitizen: React.FC = () => {
  // State to manage form data and modal visibility
  const [formData, setFormData] = useState<CitizenData>({
    name: "",
    age: 0,
    address: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Citizen created:", formData);
    // Close the modal after submission
    setIsModalOpen(false);
  };

  // Handle modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex mt-10">
      {/* Button to open the modal */}
      <button
        onClick={toggleModal}
        className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600 transition duration-300"
      >
        Create Citizen
      </button>

      {/* Modal structure */}
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
              <div className="mb-6">
                <label htmlFor="address" className="block text-lg font-medium">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                >
                  Create Citizen
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
};

export default CreateCitizen;
