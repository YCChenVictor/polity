import { WagmiConfig } from "wagmi";
import EventListener from "./components/EventListener";
import { config } from "./wagmi.config";

function App() {
  return (
    <WagmiConfig config={config}>
      <EventListener />
    </WagmiConfig>
  );
}

export default App;
