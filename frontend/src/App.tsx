import { useAccount } from "wagmi";
import ConnectButton from "./features/ConnectButton";
import Tabs from "./features/Tabs";

function App({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  const { isConnected } = useAccount();

  return (
    <>
      <ConnectButton />
      {isConnected ? <Tabs address={governmentAddress} /> : <></>}
    </>
  );
}

export default App;
