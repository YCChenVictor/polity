// npx hardhat compile
// npx hardhat run scripts/deploy/polity/offChain.ts --network localhost

// We may can move this deploy to backend code
// Now, just deploy it with the pre generated bill hash and use it in the frontend

import { keccak256, toUtf8Bytes } from "ethers";

const generateBillId = (bill: object): string => {
    const json = JSON.stringify(bill);
    return keccak256(toUtf8Bytes(json));
  };

const bill = generateBillId({
  "屆": 11,
  "議案編號": "202110143390000",
  "會議代碼": "院會-11-3-21",
  "會議代碼:str": "第11屆第3會期第21次會議",
  "資料抓取時間": "2025-07-16T09:19:54+08:00",
  "最新進度日期": "2025-07-22",
  "法律編號": [
    "04539"
  ],
  "法律編號:str": [
    "妨害兵役治罪條例"
  ],
  "相關附件": [
    {
      "網址": "https://ppg.ly.gov.tw/ppg/download/agenda1/02/pdf/11/03/21/LCEWA01_110321_00006.pdf",
      "名稱": "關係文書PDF"
    },
    {
      "網址": "https://ppg.ly.gov.tw/ppg/download/agenda1/02/word/11/03/21/LCEWA01_110321_00006.doc",
      "名稱": "關係文書DOC",
      "HTML結果": "https://v2.ly.govapi.tw/bill_doc/LCEWA01_110321_00006/html"
    }
  ],
  "議案名稱": "「妨害兵役治罪條例第四條條文修正草案」，請審議案。",
  "提案單位/提案委員": "本院委員鍾佳濱等21人",
  "議案狀態": "排入院會",
  "提案人": [
    "鍾佳濱",
    "賴瑞隆"
  ],
  "議案類別": "法律案",
  "提案來源": "委員提案",
  "會期": 3,
  "字號": "院總第20號委員提案第11014339號",
  "提案編號": "20委11014339",
  "url": "https://ppg.ly.gov.tw/ppg/bills/202110143390000/details"
})

console.log("Bill ID:", bill);

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // Get the contract factory for "OffChain"
  const OffChain = await hre.ethers.getContractFactory("OffChain");

  // Deploy the contract (no constructor parameters needed)
  const offChainContract = await OffChain.deploy(bill);

  const address = await offChainContract.getAddress();
  console.log("offChainContract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
