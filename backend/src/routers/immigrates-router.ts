// src/routers/immigrates-router.ts
import { Router } from "express";

const router = Router();

const immigrates = [
  { name: "Canada" },
  { name: "Germany" },
  { name: "Australia" },
];

router.get("/", (req, res) => {
  res.json(immigrates);
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  immigrates.push({ name });
  res.status(201).json({ success: true });
});

export default router;
