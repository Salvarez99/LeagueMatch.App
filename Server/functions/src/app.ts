import express from "express";
import { lobbyRouter } from "./routes/lobby.routes";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use("/lobby", lobbyRouter);
app.use("/user", userRouter);