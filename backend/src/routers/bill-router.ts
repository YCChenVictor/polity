import express from "express";
import bills from '../data/bills.json';
// import axios from "axios"

const billRouter = express.Router();

// Define types for the Bill data
interface Bill {
  billId: string;  // This will now map to '議案編號'
  title: string;   // '議案名稱'
  proposer: string; // '提案單位/提案委員'
  status: string;  // '議案狀態'
  url: string;     // 'url'
}


const billsJSON: { [key: string]: Bill } = {};

// Let's do the MVP first
// source https://v2.ly.govapi.tw/bills`
billRouter.get("/", async (req, res) => {
  try {
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch legislator data: ${err}` });
  }
});

// This will be implemented once the database schema is clear
billRouter.post("/", async (req, res) => {
  try {
    // Fetch bills from the external API
    // const response = await axios.get<{ bills: any[] }>('https://v2.ly.govapi.tw/bills');
    // const bills = response.data.bills; // The actual bills array

    console.log(bills); // Log the bills array to the console for debugging

    // Process each bill and store it in the in-memory JSON object
    // bills.forEach((bill) => {
    //   // Use '議案編號' as billId
    //   const { '議案編號': billId, '議案名稱': title, '提案單位/提案委員': proposer, '議案狀態': status, url } = bill;

    //   // Ensure 'billId' is part of the data you're storing
    //   billsJSON[billId] = { billId, title, proposer, status, url };
    // });

    console.log(billsJSON)
    // Respond with the stored JSON data
    res.json(billsJSON);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills data' });
  }
});

export default billRouter;
