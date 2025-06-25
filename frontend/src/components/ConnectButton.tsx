// src/ConnectButton.tsx
import { useConnect } from "wagmi";

export default function ConnectButton() {
  const { connectors, connect, status, error } = useConnect();
  // status is "idle" | "pending" | "error" | "success"

  return (
    <div>
      {connectors.map((c) => (
        <button
          key={c.id}
          disabled={status === "pending"}
          onClick={() => connect({ connector: c })}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2"
        >
          {status === "pending" && c.id === connectors[0].id
            ? "Connecting…"
            : `Connect ${c.name}`}
        </button>
      ))}
      {status === "error" && <p className="text-red-500">{error?.message}</p>}
    </div>
  );
}
