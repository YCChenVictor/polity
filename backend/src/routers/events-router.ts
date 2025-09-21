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
    console.log(error);
    res.status(500).json({ error: String(error) });
  }
});

// curl http://localhost:5000/events/
router.get("/", async (_req, res) => {
  try {
    await ipfsService.mfsList("/staging");

    const entries = await ipfsService.mfsList("/staging");
    res.json(entries);
  } catch (error) {
    console.error("Error listing /staging:", error);
    res.status(500).json({ error: String(error) });
  }
});

// curl http://localhost:5000/events/:cid
// router.get("/:cid", async (req, res) => {
//   const { cid } = req.params;
//   try {
//     const chunks: Uint8Array[] = [];
//     for await (const c of ipfsService["ipfs"].cat(cid)) {
//       chunks.push(c);
//     }
//     const buf = Buffer.concat(chunks as Buffer[]);
//     res.type("application/octet-stream").send(buf);
//   } catch (e) {
//     res.status(404).json({ error: `CID not found: ${String(e)}` });
//   }
// });

export default router;
