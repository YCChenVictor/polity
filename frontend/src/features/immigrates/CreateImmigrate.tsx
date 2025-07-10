import { useState } from "react";
import { isAddress } from "viem";

function CreateImmigrate() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(address)) {
      setError("Invalid wallet address");
      return;
    }
    setError("");

    await fetch("http://localhost:5000/immigrates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address }),
    });

    setName("");
    setAddress("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-4 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Create Immigrate</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Wallet Address"
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
    </form>
  );
}

export default CreateImmigrate;
