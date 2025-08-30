import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";

const signInWithEthereum = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const { nonce } = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/auth/nonce`,
  ).then((r) => r.json());

  const msg = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in to Polity.",
    uri: window.location.origin,
    version: "1",
    chainId: 1,
    nonce,
  });
  const prepared = msg.prepareMessage();
  const signature = await signer.signMessage(prepared);

  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prepared, signature, nonce }),
  });
  if (!res.ok) throw new Error("SIWE verify failed");
  const { token } = await res.json();

  return token;
};

export default function SiweLoginButton() {
  const handleLogin = async () => {
    try {
      const token = await signInWithEthereum();
      localStorage.setItem("authToken", token);
      console.log("✅ Access token:", token);
    } catch (err) {
      console.error("❌ SIWE login failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-black text-white rounded-lg"
    >
      Sign in with Ethereum
    </button>
  );
}
