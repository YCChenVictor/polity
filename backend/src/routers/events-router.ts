import express from "express";
import Event from "../models/event";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, actor, date, status } = req.body;

    if (!title || !date || !actor) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.create({
      title,
      description,
      actor,
      date,
      status,
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["date", "DESC"]],
    });
    return res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
