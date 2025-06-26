import { useAccount } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import Governor from "./components/Governor";

export default function App() {
  const { isConnected } = useAccount();
  return <>{isConnected ? <Governor /> : <ConnectButton />}</>;
}
