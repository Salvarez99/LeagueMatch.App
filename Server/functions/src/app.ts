import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./tsoa/routes";
import swaggerDocument from "./tsoa/swagger.json";
import {errorHandler} from "./middleware/errorHandler";
import { expressAuthentication } from "./auth/expressAuth";

export const app = express();
app.use(express.json());

swaggerDocument.servers= [{url:"/league-match-app/us-central1/api"}];
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export {expressAuthentication};
RegisterRoutes(app);

app.use(errorHandler);
