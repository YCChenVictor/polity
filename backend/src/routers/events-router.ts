import express from "express";
import multer from "multer";
import IpfsService from "../services/ipfs";

// import LLMService from "../services/llm";

const router = express.Router();
const ipfsService = new IpfsService();

if (!process.env.IPFS_API) {
  throw new Error("Missing IPFS_API in environment");
}

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
    if (!req.file)
      return res.status(400).json({ error: "file required (field: file)" });
    const result = await ipfsService.mfsCreate(req.file as Express.Multer.File);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// curl http://localhost:5000/events/
router.get("/", async (_req, res) => {
  try {
    await ipfsService.mfsMkdir("/staging", true);

    const entries = await ipfsService.mfsList("/staging");
    res.json(entries);
  } catch (error) {
    console.error("Error listing /staging:", error);
    res.status(500).json({ error: String(error) });
  }
});

// curl http://localhost:5000/events/:cid
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const chunks: Uint8Array[] = [];
    for await (const c of ipfsService["ipfs"].cat(cid)) {
      chunks.push(c);
    }
    const buf = Buffer.concat(chunks as Buffer[]);
    res.type("application/octet-stream").send(buf);
  } catch (e) {
    res.status(404).json({ error: `CID not found: ${String(e)}` });
  }
});

// curl -X POST http://localhost:5000/events/:cid/constitutional-check
router.post("/:cid/constitutional-check", async (req, res) => {
  const { cid } = req.params;
  try {
    // ensure dir
    await ipfsService.mfsMkdir(`/staging/${cid}`, true);

    // use provided body if any; else default sample
    const aiCheck = req.body ?? {
      verdict: "unclear",
      reason:
        "此修正案並非直接明文違憲，但在功能性影響、比例原則與權力分立面向存在高度疑慮，若無合憲解釋配套，實務上可能造成憲法法庭失能。",
      confidence: 0.8,
      analysis: {
        程序合法性:
          "立委提案、委員會審查、送院會處理，程序上符合規定 → 無程序違憲。",
        明文衝突: "與憲法訴訟法可能形成內部矛盾，但非直接衝突。",
        功能性影響: "人數不足時可能癱瘓審理 → 高風險。",
        比例原則: "目的合理但手段僵化 → 疑違反比例原則。",
        平等原則: "影響低。",
        權力分立: "恐對司法權造成不當干預。",
        合憲解釋可能性: "可採在職人數解釋以避免癱瘓。",
      },
    };

    const outPath = `/staging/${cid}/constitutional-check.json`;
    await ipfsService.mfsWriteJson(outPath, aiCheck);

    const stat = await ipfsService.mfsStat(outPath); // add this wrapper if you don't have it
    res.json({
      ok: true,
      path: outPath,
      cid: stat.cid?.toString?.() ?? "",
      size: Number(stat.size ?? 0),
      type: stat.type,
    });
  } catch (err) {
    console.error("constitutional-check error:", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
