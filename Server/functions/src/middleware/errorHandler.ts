// middleware/errorHandler.ts
import { ValidateError } from "tsoa";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // tsoa validation errors
  if (err instanceof ValidateError) {
    return res.status(422).json({
      success: false,
      error: "ValidationError",
      details: err.fields,
    });
  }

  // Custom AppErrors (your pattern)
  if (err && typeof err === "object" && "statusCode" in err) {
    const anyErr = err as any;
    return res.status(anyErr.statusCode).json({
      success: false,
      error: anyErr.name,
      message: anyErr.message,
      code: anyErr.code,
    });
  }

  // Generic JS errors
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      error: "InternalServerError",
      message: err.message,
    });
  }

  // Absolute fallback
  return res.status(500).json({
    success: false,
    error: "UnknownError",
  });
}
