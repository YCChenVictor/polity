import { useEffect, useState } from "react";

interface Application {
  name: string;
  wallet_address: string;
}

function Applications() {
  const [, setData] = useState<Application[]>([]);
  const [newApp, setNewApp] = useState<Application>({
    name: "",
    wallet_address: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/immigrates/applications")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleCreate = async () => {
    await fetch("http://localhost:5000/immigrates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    })
      .then((res) => res.json())
      .then((createdApp) => {
        setData((prevData) => [...prevData, createdApp]); // Add the newly created application to the list
        setIsFormOpen(false); // Close the form
        setNewApp({
          name: "",
          wallet_address: "",
        }); // Reset form fields
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
        onClick={() => setIsFormOpen(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Application
      </button>

      {/* Show the form when isFormOpen is true */}
      {isFormOpen && (
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Create New Application</h3>
          <form onSubmit={(e) => e.preventDefault()}>
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

            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Application
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Applications;
