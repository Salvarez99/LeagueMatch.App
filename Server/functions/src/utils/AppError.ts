export class AppError extends Error {
  public statusCode: number;
  public code: string | null;

  constructor(message: string, statusCode = 400, code: string | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Common convenience subclasses:
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
