// import { useReadContract } from "wagmi";
// import { baseGovernanceAbi } from "../generated";

const governorAddress = process.env.REACT_APP_GOVERNOR_ADDRESS as `0x${string}`;
const governmentAddress = process.env
  .REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`;

if (!governorAddress) {
  throw "No governorAddress";
}

if (!governmentAddress) {
  throw "No governmentAddress";
}

// Read view from contracts will not cost ETH
function isGovernor() {
  // Remove this one
  return true;
}

export { isGovernor };
