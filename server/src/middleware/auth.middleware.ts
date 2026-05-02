import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../services/auth.service.js";

// Extend Express Request to include anonymous_id and role
declare global {
  namespace Express {
    interface Request {
      anonymousId?: string;
      userRole?: string;
    }
  }
}

/**
 * JWT authentication middleware.
 * Extracts the anonymous_id and role from the token and attaches it to req.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const { sub, role } = verifyJWT(token);
    req.anonymousId = sub;
    req.userRole = role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * RBAC middleware for admin-only routes.
 * Must be used AFTER authMiddleware.
 */
export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.userRole !== "admin") {
    res.status(403).json({
      error: { code: "FORBIDDEN", message: "Admin access required" },
    });
    return;
  }
  next();
}
