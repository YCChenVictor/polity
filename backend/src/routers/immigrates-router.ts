// src/routers/immigrates-router.ts
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    { name: "Canada" },
    { name: "Germany" },
    { name: "Australia" }
  ]);
});

export default router;
