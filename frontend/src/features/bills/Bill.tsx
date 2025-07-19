import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { polityGovernmentAbi } from "../../generated";
import { keccak256, toUtf8Bytes } from "ethers";

interface Bill {
  屆: number;
  議案編號: string;
  會議代碼: string;
  會議代碼_str: string;
  資料抓取時間: string;
  最新進度日期: string;
  法律編號: string[];
  法律編號_str: string[];
  相關附件: {
    網址: string;
    名稱: string;
    HTML結果?: string;
  }[];
  議案名稱: string;
  提案單位_提案委員: string;
  議案狀態: string;
  提案人: string[];
  議案類別: string;
  提案來源: string;
  會期: number;
  字號: string;
  提案編號: string;
  url: string;
}

const BillComponent: React.FC<{ govAddress: `0x${string}`; bill: Bill }> = ({
  govAddress,
  bill,
}) => {
  const [addInProgress, setAddInProgress] = useState(false);
  const [voteInProgress, setVoteInProgress] = useState(false);

  const generateBillId = (bill: object): string => {
    const json = JSON.stringify(bill);
    return keccak256(toUtf8Bytes(json));
  };

  const {
    writeContract,
    // isPending,
    // isError,
    // isSuccess,
    // error: writeError,
  } = useWriteContract();

  const handleVote = async () => {
    setVoteInProgress(true);
    try {
      //   await writeContract({
      //     address,
      //     abi: polityGovernmentAbi,
      //     functionName: "voteRule",
      //     args: [BigInt(id)],
      //   });
      console.log(`Voted on rule}`);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoteInProgress(false);
    }
  };

  const handleAddOnChain = async () => {
    setAddInProgress(true);
    try {
      console.log(`Adding rule on chain`);
      const uupsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with actual UUPS address
      const billId = generateBillId(bill);
      writeContract({
        address: govAddress,
        abi: polityGovernmentAbi,
        functionName: "proposeOffChainRule",
        args: [uupsAddress, billId],
      });
    } catch (error) {
      console.error("Error adding on chain:", error);
    }
    setAddInProgress(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <button
        onClick={() => handleVote()} // Vote on rule
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={voteInProgress} // Disable while voting is in progress
      >
        {voteInProgress ? "Voting..." : "Vote It"}
      </button>
      <button
        onClick={() => handleAddOnChain()} // Vote on rule
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={addInProgress} // Disable while voting is in progress
      >
        {addInProgress ? "Adding..." : "Add On Chain"}
      </button>
      <h2 className="text-xl font-semibold text-gray-800">{bill.議案名稱}</h2>
      <p className="text-gray-600 mt-2">
        <strong>議案編號:</strong> {bill.議案編號}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>會議代碼:</strong> {bill.會議代碼_str}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>資料抓取時間:</strong>{" "}
        {new Date(bill.資料抓取時間).toLocaleString()}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>最新進度日期:</strong>{" "}
        {new Date(bill.最新進度日期).toLocaleString()}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>法律編號:</strong> {bill.法律編號_str?.join(", ") || "N/A"}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>提案單位/提案委員:</strong> {bill.提案單位_提案委員}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>議案狀態:</strong> {bill.議案狀態}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>提案人:</strong> {bill.提案人?.join(", ") || "N/A"}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>議案類別:</strong> {bill.議案類別}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>提案來源:</strong> {bill.提案來源}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>會期:</strong> {bill.會期}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>字號:</strong> {bill.字號}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>提案編號:</strong> {bill.提案編號}
      </p>
      <a
        href={bill.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 mt-4 block"
      >
        詳細資料
      </a>

      <h3 className="text-lg font-semibold text-gray-800 mt-4">相關附件</h3>
      <ul className="mt-2">
        {bill.相關附件?.map((attachment, index) => (
          <li key={index} className="mt-2">
            <a
              href={attachment.網址}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {attachment.名稱}
            </a>
            {attachment.HTML結果 && (
              <a
                href={attachment.HTML結果}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 ml-2"
              >
                (HTML結果)
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default BillComponent;
