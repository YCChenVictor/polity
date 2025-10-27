import { Request, Response } from "express";
import express from "express";
import { check, validationResult } from "express-validator";

import { judgeCheck } from "../services/judge";

const router = express.Router();

router.post(
  "/",
  [
    check("contentFile").isString().withMessage("path must be a string"),
    check("ruleFile").isString().withMessage("path must be a string"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const ruleFile = req.body.ruleFile;
      const contentFile = req.body.contentFile;
      const judgement = await judgeCheck(ruleFile, contentFile);
      if (!judgement) {
        res.status(400).json({ error: "File content not acceptable" });
        return;
      }

      res.json({});
      return;
    } catch (err) {
      res
        .status(500)
        .json({ error: `Failed to check compliance data: ${err}` });
      return;
    }
  },
);

export default router;
