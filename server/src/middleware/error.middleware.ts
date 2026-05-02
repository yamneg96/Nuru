import { logger } from "../utils/logger.js";
import { ZodError } from "zod";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Global error handling middleware.
 * Ensures all errors are returned in a consistent JSON format.
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || "INTERNAL_ERROR";
  let details = err.details;

  if (err instanceof ZodError || err.name === "ZodError" || (err as any).issues) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    const zodErr = err as any;
    message = zodErr.errors?.[0]?.message || zodErr.issues?.[0]?.message || "Validation failed";
    details = zodErr.errors || zodErr.issues;
  }

  logger.error({ err, method: req.method, url: req.url }, "Unhandled Server Error");

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
    },
  });
}
