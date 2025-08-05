import { useReadContract } from "wagmi";
import { useEffect } from "react";

import { polityGovernmentAbi } from "../generated";

import CheckContractDeployment from "./governance/Government";
import SetCitizenRegistry from "./governance/SetCitizenRegistry";
import SetGovernorProposalSystem from "./governance/SetGovernorProposalSystem";

import { isGovernor } from "../contracts/governor";

interface GovernanceModuleView {
  name: string;
  moduleAddress: `0x${string}`;
}

function Governance({
  govAddress,
  onSetupComplete,
}: {
  govAddress: `0x${string}`;
  onSetupComplete: () => void;
}) {
  const { data: isGovernor } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "isGovernor",
    args: [process.env.REACT_APP_GOVERNOR_ADDRESS as `0x${string}`],
  });

  const {
    data: modules,
    isLoading: loadingModules,
    error: errorModules,
  } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "listGovernanceModules",
  });

  useEffect(() => {
    if (modules && !loadingModules && !errorModules) {
      onSetupComplete();
    }
  }, [modules, loadingModules, errorModules, onSetupComplete]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Government Address</h2>
      <CheckContractDeployment />
      <h2 className="text-xl font-bold">
        {isGovernor ? "You are a Governor" : "You are NOT a Governor"}
      </h2>
      <h2 className="text-xl font-bold">Governance Modules</h2>

      {loadingModules && <p>Loading...</p>}
      {errorModules && (
        <p className="text-red-500">
          Error loading modules: {errorModules.message}
        </p>
      )}
      {modules && (
        <ul className="space-y-2">
          {(modules as GovernanceModuleView[])?.map((m, i) => (
            <li key={i}>
              <strong>{m.name}</strong>: {m.moduleAddress}
            </li>
          ))}
        </ul>
      )}

      {isGovernor && (
  <>
    <SetCitizenRegistry govAddress={govAddress} />
    <SetGovernorProposalSystem govAddress={govAddress} />
  </>
)}
    </div>
  );
}

export default Governance;
