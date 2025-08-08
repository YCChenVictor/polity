import express from "express";
import cors from "cors";
import immigratesRouter from "./routers/immigrates-router";
import contributionsRouter from "./routers/contribution-router";
import legislatorRouter from "./routers/legislator-router";
import bullRouter from "./routers/bill-router";
import eventsRouter from "./routers/events-router";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/immigrates", immigratesRouter);
app.use("/contributions", contributionsRouter);
app.use("/legislators", legislatorRouter);
app.use("/bills", bullRouter);
app.use("/events", eventsRouter);

export default app;