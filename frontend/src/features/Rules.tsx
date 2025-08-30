import React, { useState } from "react";
import RawLaw from "../laws/ChLaw.json";
import { useReadContract, useWriteContract } from "wagmi";
import { governmentAbi } from "../generated";
import { LawJson } from "../models/law";
import LawShow from "./rules/LawShow";

function Rules({ govAddress }: { govAddress: `0x${string}` }) {
  const laws = (RawLaw as LawJson).Laws;
  const [newLevel, setNewLevel] = useState("");
  const { writeContract } = useWriteContract();

  const handleCreateLawLevel = async () => {
    try {
      await writeContract({
        address: govAddress,
        abi: governmentAbi,
        functionName: "addLawLevel",
        args: [newLevel],
      });
      alert("Law level added");
      setNewLevel("");
    } catch {
      alert("Failed to add law level");
    }
  };

  const { data: lawLevels } = useReadContract({
    address: govAddress,
    abi: governmentAbi,
    functionName: "getLawLevels",
  });

  return (
    <>
      <div>
        {lawLevels?.map((level: string, i: number) => (
          <div key={i}>{level}</div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
          placeholder="Enter new law level"
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={handleCreateLawLevel}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create LawLevel
        </button>
      </div>
      <LawShow Laws={laws} />
    </>
  );
}

export default Rules;
