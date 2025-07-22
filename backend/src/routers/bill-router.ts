import express from "express";
import legislators from '../data/legislators.json';
import bills from '../data/bills.json';

const bullRouter = express.Router();

// Let's do the MVP first
// source https://v2.ly.govapi.tw/bills`
bullRouter.get("/", async (req, res) => {
  try {
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch legislator data: ${err}` });
  }
});

export default bullRouter;
