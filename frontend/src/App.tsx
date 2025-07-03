import { useAccount } from "wagmi";
import ConnectButton from "./features/ConnectButton";
import Tabs from "./features/Tabs";

function App({ address }: { address: `0x${string}` }) {
  const { isConnected } = useAccount();

  return <>{isConnected ? <Tabs address={address} /> : <ConnectButton />}</>;
}

export default App;
