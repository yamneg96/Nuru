import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

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
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_ERROR";

  logger.error({ err, method: req.method, url: req.url }, "Unhandled Server Error");

  res.status(statusCode).json({
    error: {
      code,
      message,
      details: err.details,
    },
  });
}
