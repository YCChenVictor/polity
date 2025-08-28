import express from "express";
import multer from "multer";
import IpfsService from "../services/ipfs";

// import LLMService from "../services/llm";

const router = express.Router();
const ipfsService = new IpfsService();

if (!process.env.IPFS_API) {
  throw new Error("Missing IPFS_API in environment");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

// const llmService = new LLMService(process.env.OPENAI_API_KEY!);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// curl -X POST http://localhost:5000/events/ -F "file=@tmp/test.txt"
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await ipfsService.mfsCreate(req.file as Express.Multer.File);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// curl http://localhost:5000/events/
router.get("/", async (_req, res) => {
  try {
    const pins = await ipfsService.mfsList();
    res.json(pins);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/:id/constitutional-check", async (req, res) => {
  try {
    // const result = await llmService.constitutionalCheck(ev);
    const result = {
      verdict: "unclear",
      reason:
        "此修正案並非直接明文違憲，但在功能性影響、比例原則與權力分立面向存在高度疑慮，若無合憲解釋配套，實務上可能造成憲法法庭失能。",
      confidence: 0.8,
      analysis: {
        程序合法性:
          "立委提案、委員會審查、送院會處理，程序上符合憲法及立法院職權行使法規定 → 無程序違憲問題。",
        明文衝突:
          "憲法增修條文第5條確定大法官員額為15人，但現行憲法訴訟法採在職人數計算。修正案若強制以15人為基準，與憲法條文本身不直接衝突，但恐與憲法訴訟法第12條形成內部矛盾。",
        功能性影響:
          "採修正案時，出缺或迴避可能導致無法達到法定評議人數，憲法法庭運作中斷 → 高風險影響憲政運作。",
        比例原則:
          "目的為確保多元觀點，但手段過於僵化，副作用（癱瘓審判）大於利益 → 疑似違反比例原則。",
        平等原則:
          "無針對特定人或群體差別待遇，屬程序設計爭議 → 平等原則影響低。",
        權力分立:
          "立法機關透過修法實質限制司法院大法官憲法解釋權，恐構成對司法權的不當干預 → 可能違反權力分立。",
        合憲解釋可能性:
          "可透過解釋將「15人」視為理想額數，仍依在職人數計算，避免癱瘓法庭 → 具合憲解釋空間。",
      },
    };
    const verdict = result.verdict as
      | "constitutional"
      | "unconstitutional"
      | "unclear";
    const reason = String(result.reason || "");

    res.json({ verdict, reason, confidence: result.confidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI check failed" });
  }
});

export default router;
