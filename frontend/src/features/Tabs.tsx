import React, { useState } from "react";
import ContractProposals from "./contracts/ContractProposals";
import Governors from "./Governors";

function Tabs({ address }: { address: `0x${string}` }) {
  const [tab, setTab] = useState("governor");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex space-x-4 px-6 py-2 bg-white border-b">
        <button
          onClick={() => setTab("governor")}
          className={`pb-2 ${
            tab === "governor"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Governor
        </button>
        <button
          onClick={() => setTab("contract-proposals")}
          className={`pb-2 ${
            tab === "contract-proposals"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Rules
        </button>
      </nav>

      <main className="p-6">
        {tab === "governor" && <Governors address={address} />}
        {tab === "contract-proposals" && (
          <ContractProposals address={address} />
        )}
      </main>
    </div>
  );
}

export default Tabs;
