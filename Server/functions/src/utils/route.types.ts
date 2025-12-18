import { RequestHandler } from "express";

export interface RouteDefinition {
  method: "post" | "patch" | "delete" | "put";
  path: string;
  handler: RequestHandler;
  meta: {
    summary: string;
    tags: string[];
  };
}
