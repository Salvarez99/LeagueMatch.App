// app.ts
import express, { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { lobbyRouter } from "./routes/lobby.routes";
import { userRoutes } from "./routes/user.routes";
import { registerRoutes } from "./utils/registerRoutes";
import { swaggerSpec, swaggerPaths } from "./swagger";

export const app = express();

app.use(express.json());

// ---- Register User routes (and populate Swagger)
const userRouter = Router();
registerRoutes(userRouter, userRoutes, swaggerPaths, "/user");
app.use("/user", userRouter);

// ---- Register Lobby routes (if migrated)
app.use("/lobby", lobbyRouter);


// TEMP DEBUG — add this
// app.get("/docs", (_req, res) => {
//   res.send("docs route reached");
// });

// console.log("swaggerUi.serve =", swaggerUi.serve);

// ---- Mount Swagger LAST
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
