import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

function Home() {
  const pc = usePublicClient();
  if (!pc) {
    return;
  }
  const [block, setBlock] = useState<bigint>(0n);

  useEffect(() => {
    const tick = async () => setBlock(await pc.getBlockNumber());
    tick();
    const id = setInterval(tick, 2000); // every 2s
    return () => clearInterval(id);
  }, [pc]);

  const polity =
    "Polity is a modular governance framework centered on two core contracts — CitizenRegistry and Agura. CitizenRegistry manages verified citizen identities and permissions, while Agura handles on-chain polls created by the system or its modules. Each poll gives one vote per registered citizen.";

  return (
    <>
      <div>{polity}</div>
      <div>{block}</div>
    </>
  );
}

export default Home;
