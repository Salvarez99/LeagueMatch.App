import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./tsoa/routes";
import swaggerDocument from "./tsoa/swagger.json";
import {errorHandler} from "./middleware/errorHandler";

export const app = express();
app.use(express.json());

swaggerDocument.servers= [{url:"/league-match-app/us-central1/api"}];
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

app.use(errorHandler);
