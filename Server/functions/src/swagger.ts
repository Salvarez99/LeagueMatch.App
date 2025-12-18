import type { OpenAPIV3 } from "openapi-types";

export const swaggerPaths: OpenAPIV3.PathsObject = {};

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "LeagueMatch API",
    version: "1.0.0",
    description: "LeagueMatch Firebase API",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  paths: swaggerPaths,
};
