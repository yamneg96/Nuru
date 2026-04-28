import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../services/auth.service.js";

// Extend Express Request to include anonymous_id
declare global {
  namespace Express {
    interface Request {
      anonymousId?: string;
    }
  }
}

/**
 * JWT authentication middleware.
 * Extracts the anonymous_id from the token and attaches it to req.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const anonymousId = verifyJWT(token);
    req.anonymousId = anonymousId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
