// utils/registerRoutes.ts
import { Router } from "express";
import { RouteDefinition } from "./route.types";

export function registerRoutes(
  router: Router,
  routes: RouteDefinition[],
  swaggerPaths: any,
  basePath: string
) {
  for (const route of routes) {
    // Express
    (router as any)[route.method](route.path, route.handler);

    // Swagger
    const fullPath = `${basePath}${route.path}`;
    swaggerPaths[fullPath] ??= {};
    swaggerPaths[fullPath][route.method] = {
      summary: route.meta.summary,
      tags: route.meta.tags,
      responses: {
        200: { description: "Success" },
      },
    };
  }
}
