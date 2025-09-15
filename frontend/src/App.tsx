import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import Topic from "./features/Topic";
import Application from "./features/immigrates/Application";
import SiweLoginButton from "./features/Auth";
import Poll from "./features/Poll";
import { citizenAbi } from "./generated";
import Citizen from "./features/Citizen";
import Init from "./features/poll/Init";

function App({ citizenAddress }: { citizenAddress: `0x${string}` }) {
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
    functionName: "pollAddress",
  });

  const pollSet =
    pollAddress && pollAddress !== "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    refreshSession();
  }, []);

  return !user ? (
    <SiweLoginButton onSuccess={refreshSession} />
  ) : (
    <>
      <Init citizenAddress={citizenAddress} />
      <Topic />
      {pollSet && (
        <Application
          citizenAddress={citizenAddress}
          pollAddress={pollAddress}
        />
      )}
      {pollSet && <Poll pollAddress={pollAddress} />}
      <Citizen citizenAddress={citizenAddress} />
    </>
  );
}

export default App;
