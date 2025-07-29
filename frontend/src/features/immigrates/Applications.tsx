import { useEffect, useState } from "react";

interface Application {
  name: string;
  wallet_address: string;
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApp, setNewApp] = useState<Application>({
    name: "",
    wallet_address: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch existing applications when component mounts
    fetch("http://localhost:5000/immigrates/applications")
      .then((res) => res.json())
      .then(setApplications)
      .catch(console.error);
  }, []);

  const handleCreate = async () => {
    // Create a new application
    await fetch("http://localhost:5000/immigrates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    })
      .then((res) => res.json())
      .then((createdApp) => {
        setApplications((prevData) => [...prevData, createdApp]); // Add new application to list
        setIsModalOpen(false); // Close the modal
        setNewApp({ name: "", wallet_address: "" }); // Reset form fields
      })
      .catch(console.error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewApp((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Immigration Applications
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Application
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Create New Application
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                handleCreate(); // Call create function on form submit
              }}
            >
              <label className="block mb-2">
                <span className="font-semibold">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={newApp.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="font-semibold">Wallet Address:</span>
                <input
                  type="text"
                  name="wallet_address"
                  value={newApp.wallet_address}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </label>

              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Application
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} // Close the modal on cancel
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of existing applications */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Existing Applications</h3>
        <ul className="space-y-2">
          {applications.map((app, index) => (
            <li key={index} className="p-4 border rounded shadow-sm bg-white">
              <p className="font-semibold">Name: {app.name}</p>
              <p className="text-sm">Wallet Address: {app.wallet_address}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Applications;
