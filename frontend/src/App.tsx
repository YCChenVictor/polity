import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Topic from "./features/Topic";
import Application from "./features/immigrates/Application";
import SiweLoginButton from "./features/Auth";

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
    </>
  );
}

export default App;
