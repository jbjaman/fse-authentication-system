import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import registerRouter from "./routes/auth/register.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", registerRouter);

app.use(errorMiddleware);

export default app;
