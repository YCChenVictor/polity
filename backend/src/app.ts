// src/app.ts
import express from "express";
import cors from "cors";
import immigratesRouter from "./routers/immigrates-router";

const app = express();

app.use(cors()); // Allow all origins by default
app.use(express.json());
app.use("/immigrates", immigratesRouter);

export default app;