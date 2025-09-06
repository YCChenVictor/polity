import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

// import { GovernanceModuleView } from "./features/Governance";
import Poll from "./features/Poll";
// import SetVoting from "./features/governance/SetVoting";
// import SetCitizen from "./features/governance/SetCitizen";
import Citizen from "./features/Citizen";
import Topic from "./features/Topic";
import Auth from "./features/Auth";
import Application from "./features/immigrates/Application";

// const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`;
// const norm = (s: string) => s.trim().toLowerCase();

function App({ citizenAddress }: { citizenAddress: `0x${string}` }) {
  const { isConnected } = useAccount();

  // const [tab, setTab] = useState<string>("");
  // store all module addresses keyed by normalized name
  // const [addr, setAddr] = useState<Record<string, `0x${string}`>>({});

  // stable: avoids infinite loops
  // const handleModulesLoaded = useCallback((mods: GovernanceModuleView[]) => {
  //   setAddr(
  //     Object.fromEntries(
  //       mods.map((m) => [norm(m.name), m.moduleAddress]),
  //     ) as Record<string, `0x${string}`>,
  //   );
  // }, []);

  // const handleModuleClick = useCallback((m: GovernanceModuleView) => {
  //   const key = norm(m.name);
  //   setTab(key);

  //   // ensure clicked module is in addr (handles static/manual entries)
  //   if (m.moduleAddress && m.moduleAddress !== ZERO) {
  //     setAddr((s) => (s[key] ? s : { ...s, [key]: m.moduleAddress }));
  //   }
  // }, []);

  const [user, setUser] = useState<{ address: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      {!user ? (
        <Auth />
      ) : (
        <>
          <Topic />
          <Application citizenAddress={citizenAddress} />
          {/* <Poll address={addr.poll} /> */}
          {/* <SetCitizen governmentAddress={governmentAddress} />
          <SetVoting governmentAddress={governmentAddress} /> */}
          {/* <Governance
        govAddress={governmentAddress}
        onModuleClick={handleModuleClick}
        onLoaded={handleModulesLoaded}
      /> */}
        </>
      )}

      {isConnected && (
        <div className="min-h-screen bg-gray-50">
          <main className="p-6 space-y-6">
            <p className="text-sm text-gray-500">
              current tab: {tab || "(none)"}
            </p>

            {tab === "poll" && addr[tab] && <Poll address={addr.poll} />}
            {tab === "citizen" && addr.citizen && (
              <Citizen citizenAddress={addr.citizen} />
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
