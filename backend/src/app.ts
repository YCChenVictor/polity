import express from "express";
import cors from "cors";

import "./env";

import immigratesRouter from "./routers/immigrates-router";
import contributionsRouter from "./routers/contribution-router";
import legislatorRouter from "./routers/legislator-router";
import bullRouter from "./routers/bill-router";
import eventsRouter from "./routers/events-router";
import authRouter from "./routers/auth-router";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ENDPOINT,
    methods: ["POST"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/immigrates", immigratesRouter);
app.use("/contributions", contributionsRouter);
app.use("/legislators", legislatorRouter);
app.use("/bills", bullRouter);
app.use("/events", eventsRouter);
app.use("/auth", authRouter);

export default app;
