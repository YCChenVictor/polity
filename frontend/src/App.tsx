import { useAccount } from "wagmi";
import React, { useState } from "react";
import ConnectButton from "./features/ConnectButton";
import Governance from "./features/Governance";
import Rules from "./features/Rules";
import Governors from "./features/Governors";
import Immigrates from "./features/Immigrates";
import Contribution from "./features/Contribution";
import Citizens from "./features/Citizens";
import OffChainBills from "./features/OffChainBills";
import OnChainProposals from "./features/OnChainProposals";

const steps = [
  { key: "governance", label: "Governance" },
  { key: "governor", label: "Governors", dependsOn: "governance" },
  { key: "immigrates", label: "Immigrates", dependsOn: "governor" },
  { key: "citizens", label: "Citizens", dependsOn: "immigrates" },
  { key: "rules", label: "Rules", dependsOn: "citizens" },
  { key: "on-chain-bills", label: "On-chain Proposals", dependsOn: "rules" },
  { key: "off-chain-bills", label: "Off-chain Bills", dependsOn: "rules" },
  { key: "contributions", label: "Contribution", dependsOn: "rules" },
];

function App({
  userAddress,
  governmentAddress,
}: {
  userAddress: `0x${string}`;
  governmentAddress: `0x${string}`;
}) {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState("governance");

  const [status, setStatus] = useState<Record<string, boolean>>({
    governance: true,
    governor: false,
    immigrates: false,
    citizens: false,
    rules: false,
  });

  const updateStatus = (key: string) => {
    setStatus((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  };

  return (
    <>
      <h2 className="text-xl font-bold mt-4 mb-2 text-center">
        台灣民眾對提案的公開投票
      </h2>
      <div className="text-center mb-4">
        <ConnectButton />
      </div>

      {isConnected && (
        <div className="min-h-screen bg-gray-50">
          <nav className="flex flex-wrap justify-center gap-4 px-4 py-3 bg-white border-b">
            {steps.map(({ key, label, dependsOn }) => {
              const disabled = dependsOn && !status[dependsOn];
              if (disabled) return null;

              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-3 py-1 text-sm font-medium border-b-2 ${
                    tab === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <main className="p-6">
            {tab === "governance" && (
              <Governance
                govAddress={governmentAddress}
                onSetupComplete={() => updateStatus("governor")}
              />
            )}
            {tab === "governor" && (
              <Governors
                address={governmentAddress}
                onSetupComplete={() => updateStatus("immigrates")}
              />
            )}
            {tab === "immigrates" && (
              <Immigrates
                govAddress={governmentAddress}
                userAddress={userAddress}
                onSetupComplete={() => updateStatus("citizens")}
              />
            )}
            {tab === "citizens" && (
              <Citizens onSetupComplete={() => updateStatus("rules")} />
            )}
            {tab === "rules" && <Rules govAddress={governmentAddress} />}
            {tab === "on-chain-bills" && (
              <OnChainProposals governmentAddress={governmentAddress} />
            )}
            {tab === "off-chain-bills" && (
              <OffChainBills governmentAddress={governmentAddress} />
            )}
            {tab === "contributions" && <Contribution />}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
