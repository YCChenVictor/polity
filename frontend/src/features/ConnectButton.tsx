import { useConnect, useAccount, useDisconnect } from "wagmi";

function ConnectButton() {
  const { connectors, connect } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl shadow">
        <span className="text-sm text-gray-700 truncate max-w-[200px]">
          Connected: {address}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
}

export default ConnectButton;
