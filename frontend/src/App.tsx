import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Topic from "./features/Topic";
import Application from "./features/immigrates/Application";
import SiweLoginButton from "./features/Auth";
import Poll from "./features/Poll";
import { citizenAbi } from "./generated";
import Citizen from "./features/Citizen";

function App({ citizenAddress }: { citizenAddress: `0x${string}` }) {
  const { isConnected } = useAccount();
  const [user, setUser] = useState<{ address: string } | null>(null);

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  async function refreshSession() {
    try {
      const res = await fetch(`${BACKEND}/auth/me`, { credentials: "include" });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
  }

  const { data: pollAddress } = useReadContract({
    address: citizenAddress,
    abi: citizenAbi,
    functionName: "poll",
  });

  useEffect(() => {
    // on mount
    refreshSession();

    // refresh when tab regains focus (handles expired/cleared cookies)
    const onFocus = () => refreshSession();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    // if wallet disconnects, reflect that in UI (session may still exist server-side)
    if (!isConnected) setUser(null);
  }, [isConnected]);

  return !user ? (
    <SiweLoginButton onSuccess={refreshSession} />
  ) : (
    <>
      <Topic />
      <Application citizenAddress={citizenAddress} />
      {pollAddress && <Poll pollAddress={pollAddress} />}
      <Citizen citizenAddress={citizenAddress} />
    </>
  );
}

export default App;
