import React, { useState } from "react";
import { usePublicClient } from "wagmi"; // For wallet connection (Wagmi)

// Component to fetch bytecode from a deployed contract
const RuleShow = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
  const [bytecode, setBytecode] = useState<string | null>(null);

  // Access the Viem client (with the provider configured for Hardhat)
  const publicClient = usePublicClient();

  // Function to fetch bytecode from the contract address
  const fetchBytecode = async () => {
    try {
      if (publicClient && contractAddress) {
        const code = await publicClient.getBytecode({
          address: contractAddress,
        });
        setBytecode(code ?? null); // Set the bytecode to display it, or null if undefined
      } else {
        console.error("Public client or contract address is not available");
      }
    } catch (error) {
      console.error("Error fetching bytecode:", error);
    }
  };

  return (
    <div>
      <h2>Get Contract Bytecode</h2>
      <button onClick={fetchBytecode}>Fetch Bytecode</button>
      {bytecode ? (
        <pre>{bytecode}</pre> // Display bytecode (in hexadecimal)
      ) : (
        <p>Click the button to fetch the bytecode of the contract.</p>
      )}
    </div>
  );
};

export default RuleShow;
