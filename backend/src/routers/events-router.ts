import { Router, Request, Response } from "express";
import multer from "multer";
import { check, validationResult } from "express-validator";

import { mutableFS, create, mfsList } from "../../../mini/lib/ipfs";

// import LLMService from "../services/llm";

const router = Router();

if (!process.env.IPFS_API) {
  throw new Error("Missing IPFS_API in environment");
}

if (!process.env.IPFS_API) {
  throw new Error("Missing IPFS_API in environment");
}

if (!process.env.VITE_OPENAI_API_KEY) {
  throw new Error("Missing VITE_OPENAI_API_KEY in environment");
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// curl -X POST http://localhost:5000/events/ -F "file=@tmp/test.txt"
router.post(
  "/",
  upload.single("file"), // upload.single("file") is a Multer middleware that processes a single uploaded file whose form-field name is "file", placing its info into req.file
  [
    check("dir").isString().withMessage("dir must be a string"),
    check("file").custom((_, { req }) => {
      if (!req.file) {
        throw new Error("file required (field: file)");
      }
      return true;
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dir = req.body.dir; // get dir from body
    const file = req.file as Express.Multer.File; // get file from req.file

    try {
      const result = await create(file, dir);

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: String(error) });
    }
  },
);

// curl http://localhost:5000/events/
router.get("/", async (_req, res) => {
  try {
    await mfsList("/staging");

    const entries = await mfsList("/staging");
    res.json(entries);
  } catch (error) {
    console.error("Error listing /staging:", error);
    res.status(500).json({ error: String(error) });
  }
});

// curl http://localhost:5000/events/init
router.get("/init", async (_req, res) => {
  try {
    const path = "/staging/constitution.md";
    let initialized = false;

    try {
      await mutableFS.stat(path);
      initialized = true;
    } catch (err) {
      if (String(err).includes("does not exist")) initialized = false;
      else throw err;
    }

    res.json({ initialized, path });
  } catch (error) {
    console.error("Error checking initialization:", error);
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
