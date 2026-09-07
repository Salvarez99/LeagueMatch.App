import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let code: string | undefined;
    let details: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse() as any;
      if (typeof responseObj === "string") {
        message = responseObj;
      } else {
        message = responseObj.message || exception.message;
        code = responseObj.code;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // Check if it's a custom AppError
      if ("statusCode" in exception) {
        const err = exception as any;
        status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        code = err.code;
      }
    }

    response.status(status).json({
      success: false,
      error:
        exception instanceof Error
          ? exception.constructor.name
          : "UnknownError",
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
