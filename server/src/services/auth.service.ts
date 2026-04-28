import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google OAuth credential token.
 * Returns the email from the verified token.
 */
export async function verifyGoogleToken(credential: string): Promise<string> {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Invalid Google token: no email found");
  }
  return payload.email;
}

/**
 * Hash an email using SHA-256.
 * CRITICAL: We never store the raw email — only this hash.
 */
export function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

/**
 * Find existing user by email hash or create a new anonymous user.
 */
export async function findOrCreateUser(emailHash: string) {
  let user = await User.findOne({ email_hash: emailHash });

  if (!user) {
    user = await User.create({
      anonymous_id: uuidv4(),
      email_hash: emailHash,
      created_at: new Date(),
      last_active: new Date(),
      preferences: { language: "english", save_history: true },
    });
  } else {
    user.last_active = new Date();
    await user.save();
  }

  return user;
}

/**
 * Generate a JWT containing only the anonymous_id.
 * NEVER put email or PII in the token.
 */
export function generateJWT(anonymousId: string): string {
  return jwt.sign({ sub: anonymousId }, env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify a JWT and return the anonymous_id.
 */
export function verifyJWT(token: string): string {
  const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string };
  return decoded.sub;
}
