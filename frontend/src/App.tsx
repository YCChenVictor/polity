import { useAccount } from "wagmi";
import ConnectButton from "./features/ConnectButton";
import React, { useState } from "react";
import Rules from "./features/Rules";
import Governors from "./features/Governors";
import Immigrates from "./features/Immigrates";
import Contribution from "./features/Contribution";

function App({
  userAddress,
  governmentAddress,
}: {
  userAddress: `0x${string}`;
  governmentAddress: `0x${string}`;
}) {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState("governor");

  return (
    <>
      <ConnectButton />
      {isConnected ? (
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
              Governors
            </button>
            <button
              onClick={() => setTab("rules")}
              className={`pb-2 ${
                tab === "contract-proposals"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Rules
            </button>
            <button
              onClick={() => setTab("immigrates")}
              className={`pb-2 ${
                tab === "immigrates"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Immigrates
            </button>
            <button
              onClick={() => setTab("contributions")}
              className={`pb-2 ${
                tab === "contributions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Contribution
            </button>
          </nav>

          <main className="p-6">
            {tab === "governor" && <Governors address={governmentAddress} />}
            {tab === "rules" && <Rules governmentAddress={governmentAddress} />}
            {tab === "immigrates" && (
              <Immigrates
                contractAddress={governmentAddress}
                userAddress={userAddress}
              />
            )}
            {tab === "contributions" && <Contribution />}
          </main>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
