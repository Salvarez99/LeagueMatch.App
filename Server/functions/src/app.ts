import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./tsoa/routes";
import swaggerDocument from "./tsoa/swagger.json";

export const app = express();
app.use(express.json());
RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err.fields,
    });
  }

  next(err);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
