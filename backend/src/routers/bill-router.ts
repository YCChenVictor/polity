import express from "express";
import legislators from '../data/legislators.json';

const bullRouter = express.Router();

bullRouter.get("/", async (req, res) => {
  try {

    const data = await fetch(
  'https://v2.ly.govapi.tw/bills',
);
console.log(data)
    // res.json(legislators);
    return;
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch legislator data: ${err}` });
  }
});

export default bullRouter;
