import React, { useState, useEffect } from "react";
import { useReadContracts, useWriteContract } from "wagmi";
import { offChainAbi, offChainRuleProposalSystemAbi } from "../../generated";
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
  const [showModal, setShowModal] = useState(false);
  const [ruleAddress, setRuleAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);

  const wordings =
    "Please deploy your desired contract on chain with the exactly bill as content first. The concept of public goods requires us to pay the cost before acquiring benefits, avoiding frauds. There will be an API in the backend to help you create such contract.";

  const generateBillId = (bill: object): string => {
    const json = JSON.stringify(bill);
    return keccak256(toUtf8Bytes(json));
  };

  const billNumber = bill["議案編號"];
  const billId = generateBillId(bill);
  const {
    writeContract,
    isPending,
    isError,
    isSuccess,
    error: writeError,
  } = useWriteContract();

  // Track whether the address is valid
  useEffect(() => {
    if (ruleAddress.startsWith("0x") && ruleAddress.length === 42) {
      setIsAddressValid(true);
    } else {
      setIsAddressValid(false);
    }
  }, [ruleAddress]);

  const { data } = useReadContracts({
    contracts: isAddressValid
      ? [
          {
            address: ruleAddress as `0x${string}`,
            abi: offChainAbi,
            functionName: "bill",
          },
        ]
      : [],
  });

  const handleAddOnChain = async () => {
    try {
      await writeContract({
        address: govAddress,
        abi: offChainRuleProposalSystemAbi,
        functionName: "proposeOffChainRule",
        args: [ruleAddress as `0x${string}`, billNumber, billId],
      });
    } catch (error) {
      console.error("Error adding on chain:", error);
    }
  };

  const isBillMatching = data && data[0]?.result === billId;
  console.log(
    isBillMatching
      ? "The contract is the same as the one in the smart contract"
      : "The contract is not the same as the one in the smart contract",
  );

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-lg font-bold mb-4">Submit Rule Address</h2>
        <p>{wordings}</p>
        <input
          type="text"
          placeholder="0x..."
          value={ruleAddress}
          onChange={(e) => setRuleAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          {isBillMatching ? (
            <button
              onClick={handleAddOnChain}
              disabled={!isAddressValid}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      {showModal && renderModal()}
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isPending || isSuccess || isError}
      >
        {isPending
          ? "Adding..."
          : isSuccess
            ? "Added"
            : isError
              ? "Error"
              : "Add On Chain"}
      </button>

      {isError && (
        <div className="mt-2 text-red-500">
          Error: {writeError?.message || "Unknown error occurred"}
        </div>
      )}

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
