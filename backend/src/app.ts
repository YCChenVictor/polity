// src/app.ts
import express from "express";
import cors from "cors";
import immigratesRouter from "./routers/immigrates-router";
import contributionsRouter from "./routers/contribution-router";
import legislatorRouter from "./routers/legislator-router";

const app = express();

app.use(cors()); // Allow all origins by default
app.use(express.json());
app.use("/immigrates", immigratesRouter);
app.use("/contributions", contributionsRouter);
app.use("/legislators", legislatorRouter);

export default app;