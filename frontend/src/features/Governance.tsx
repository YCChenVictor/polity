import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { polityGovernmentAbi } from "../generated";

export interface GovernanceModuleView {
  name: string;
  moduleAddress: `0x${string}`;
}

interface Props {
  govAddress: `0x${string}`;
  onModuleClick: (m: GovernanceModuleView) => void;
}

export default function Governance({ govAddress, onModuleClick }: Props) {
  const { data, isLoading, error } = useReadContract({
    address: govAddress,
    abi: polityGovernmentAbi,
    functionName: "listGovernanceModules",
  });

  const modules = useMemo(
    () => (data as GovernanceModuleView[] | undefined) ?? [],
    [data],
  );

  if (isLoading) return <p>Loading modules…</p>;
  if (error) return <p className="text-red-600">Failed to load modules</p>;
  if (!modules.length) return <p>No modules found.</p>;

  return (
    <ul className="space-y-2">
      {modules.map((m) => (
        <li key={m.moduleAddress}>
          <button
            className="px-3 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onModuleClick(m)}
          >
            {m.name}
          </button>
          <span className="ml-2 text-gray-700">{m.moduleAddress}</span>
        </li>
      ))}
    </ul>
  );
}
