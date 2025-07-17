import express from "express";
import https from 'https';
import legislators from '../data/legislators.json';

const router = express.Router();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

router.get("/", async (req, res) => {
  try {

    res.json(legislators);
    return;
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch legislator data: ${err}` });
  }
});

export default router;
