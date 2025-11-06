import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

import "./env";

// import immigratesRouter from "./routers/immigrates-router";
// import contributionsRouter from "./routers/contribution-router";
// import legislatorRouter from "./routers/legislator-router";
// import bullRouter from "./routers/bill-router";
import eventsRouter from "./routers/events-router";
import authRouter from "./routers/auth-router";

const app = express();

app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ENDPOINT,
    methods: ["POST"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, World!");
  return;
});

app.use("/auth", authRouter);

app.use("/events", eventsRouter);

// app.use("/immigrates", immigratesRouter);
// app.use("/contributions", contributionsRouter);
// app.use("/legislators", legislatorRouter);
// app.use("/bills", bullRouter);

export default app;
