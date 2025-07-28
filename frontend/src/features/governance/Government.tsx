import { usePublicClient } from "wagmi";
import { useState, useEffect } from "react";

function CheckContractDeployment() {
  const [isDeployed, setIsDeployed] = useState(false);
  const publicClient = usePublicClient();

  const contractAddress = process.env
    .REACT_APP_GOVERNOR_ADDRESS as `0x${string}`;

  if (!contractAddress) {
    throw new Error("No REACT_APP_GOVERNMENT_ADDRESS");
  }

  useEffect(() => {
    const checkDeployment = async () => {
      // Ensure publicClient is defined
      if (!publicClient) {
        console.error("Public client is not available.");
        return;
      }

      try {
        const code = await publicClient.getCode({ address: contractAddress });
        setIsDeployed(code !== "0x");
      } catch (error) {
        console.error("Error checking deployment:", error);
        setIsDeployed(false);
      }
    };

    checkDeployment();
  }, [publicClient]);

  return (
    <div>
      {isDeployed ? "Contract is deployed" : "Contract is not deployed"}
    </div>
  );
}

export default CheckContractDeployment;
