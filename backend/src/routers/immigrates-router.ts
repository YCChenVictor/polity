// src/routers/immigrates-router.ts
import { Router } from "express";

const router = Router();

const immigrates = [
  { name: "Canada", wallet_address: "" },
  { name: "Germany", wallet_address: "" },
  { name: "Australia", wallet_address: "" },
];

// Directly create applications here
// There will be a mechanism to create the applications
let applications = [
  { name: "haha", wallet_address: "test", origin: "", reason: "", assets: "" },
  { name: "haha", wallet_address: "test1", origin: "", reason: "", assets: "" },
];

router.get("/", (req, res) => {
  res.json(immigrates);
});

router.get("/applications", (req, res) => {
  res.json(applications);
});

router.post("/", (req, res) => {
  const { name, wallet_address } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!wallet_address)
    return res.status(400).json({ error: "Wallet is required" });

  immigrates.push({ name, wallet_address });
  applications = applications.filter(
    (app) => app.wallet_address !== wallet_address,
  );

  res.status(201).json(applications);
});

export default router;
