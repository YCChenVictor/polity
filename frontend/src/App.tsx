import { useAccount } from "wagmi";
import { useState } from "react";

import ConnectButton from "./features/ConnectButton";
import Governance, { GovernanceModuleView } from "./features/Governance";
import Vote from "./features/Poll";
import Rules from "./features/Rules";
import SetVoting from "./features/governance/SetVoting";
import SetCitizen from "./features/governance/SetCitizen";
import Citizen from "./features/Citizen";

function App({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<string>("");
  const [citizenAddress, setCitizenAddress] = useState<`0x${string}`>(
    "0x0000" as `0x${string}`,
  );
  const [votingAddress, setVotingAddress] = useState<`0x${string}`>(
    "0x0000" as `0x${string}`,
  );

  const handleModuleClick = (m: GovernanceModuleView) => {
    const key = (m.name || "").trim();
    console.log(
      "clicked module:",
      key,
      "→ tab:",
      key,
      "addr:",
      m.moduleAddress,
    );
    setTab(key);
    if (key === "vote") setVotingAddress(m.moduleAddress);
    if (key === "citizen") setCitizenAddress(m.moduleAddress);
  };

  return (
    <>
      <h2 className="text-xl font-bold mt-4 mb-2 text-center">
        台灣民眾對提案的公開投票
      </h2>

      <div className="text-center mb-4">
        <ConnectButton />
      </div>

      <SetCitizen governmentAddress={governmentAddress} />
      <SetVoting governmentAddress={governmentAddress} />

      {isConnected && (
        <div className="min-h-screen bg-gray-50">
          <main className="p-6 space-y-6">
            <Governance
              govAddress={governmentAddress}
              onModuleClick={handleModuleClick}
            />

            <p className="text-sm text-gray-500">
              current tab: {tab || "(none)"}
            </p>

            {tab === "vote" && votingAddress && (
              <Vote address={votingAddress} />
            )}
            {tab === "citizen" && <Citizen citizenAddress={citizenAddress} />}
            {tab === "rules" && <Rules govAddress={governmentAddress} />}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
