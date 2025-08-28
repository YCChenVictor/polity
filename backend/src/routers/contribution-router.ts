// src/routers/immigrates-router.ts
import { Router } from "express";

const router = Router();

const contributions = [
  { title: "Canada", content: "" },
  { title: "Germany", content: "" },
  { title: "Australia", content: "" },
];

router.get("/", (req, res) => {
  res.status(200).json(contributions);
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  contributions.push({ title, content });

  res.status(201).json(contributions);
});

export default router;
