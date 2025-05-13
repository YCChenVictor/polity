import { createConfig, WagmiConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import EventListener from "./components/EventListener";

const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  connectors: [injected()],
});

function App() {
  return (
    <WagmiConfig config={config}>
      {"testing"}
      <EventListener />
    </WagmiConfig>
  );
}

export default App;
