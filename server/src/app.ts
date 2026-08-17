import express from "express";
import registerRouter from "./routes/auth/register.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", registerRouter);

export default app;
