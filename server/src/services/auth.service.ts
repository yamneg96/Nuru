import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { User, type IUser } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { DecisionSession } from "../models/DecisionSession.js";
import { UserProgress } from "../models/UserProgress.js";
import { RefreshToken } from "../models/RefreshToken.js";
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
 * Find existing user by email hash or create a new user.
 * If previousAnonymousId is provided, migrates history.
 */
export async function findOrCreateUser(emailHash: string, previousAnonymousId?: string) {
  let user = await User.findOne({ email_hash: emailHash });

  if (user) {
    // Scenario B: Returning user logging in on a new device.
    // If they have temporary history on this new device, merge it into their permanent account.
    user.last_active = new Date();
    await user.save();

    if (previousAnonymousId && previousAnonymousId !== user.anonymous_id) {
      // Find the temporary user account to ensure it exists
      const tempUser = await User.findOne({ anonymous_id: previousAnonymousId });
      
      if (tempUser && !tempUser.email_hash) {
        // Only merge if the temporary user is truly an anonymous "ghost" account
        await Promise.all([
          ChatLog.updateMany({ anonymous_id: previousAnonymousId }, { $set: { anonymous_id: user.anonymous_id } }),
          DecisionSession.updateMany({ anonymous_id: previousAnonymousId }, { $set: { anonymous_id: user.anonymous_id } }),
          UserProgress.updateMany({ anonymous_id: previousAnonymousId }, { $set: { anonymous_id: user.anonymous_id } })
        ]);
        
        // Delete the ghost account
        await User.deleteOne({ _id: tempUser._id });
      }
    }
  } else {
    // Scenario A: Brand new signup with Google
    if (previousAnonymousId) {
      user = await User.findOne({ anonymous_id: previousAnonymousId });
      if (user && !user.email_hash) {
        // Upgrade the anonymous user to a permanent user
        user.email_hash = emailHash;
        user.last_active = new Date();
        await user.save();
        return user;
      }
    }

    // Fallback: If no previous session, create a completely new user
    user = await User.create({
      anonymous_id: uuidv4(),
      email_hash: emailHash,
      created_at: new Date(),
      last_active: new Date(),
      preferences: { language: "english", save_history: true },
    });
  }

  return user;
}

/**
 * Verify admin credentials.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<IUser> {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail, role: { $in: ["admin", "super_admin"] } });

  if (!user || !user.password_hash) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}

/**
 * Generate Access and Refresh tokens.
 */
export async function generateTokens(user: IUser) {
  const anonymousId = user.anonymous_id || user._id.toString();
  const accessToken = jwt.sign(
    { sub: anonymousId, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );

  const refreshToken = jwt.sign(
    { sub: anonymousId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );

  // Store refresh token in DB
  const decoded = jwt.decode(refreshToken) as { exp: number };
  await RefreshToken.create({
    token: refreshToken,
    user_id: user._id,
    anonymous_id: anonymousId,
    expires_at: new Date(decoded.exp * 1000),
  });

  return { accessToken, refreshToken };
}

/**
 * Generate a new Access Token using a valid Refresh Token.
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
    
    // Check if token exists in DB
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) throw new Error("Refresh token not found");

    const user = await User.findOne({ 
      $or: [{ anonymous_id: decoded.sub }, { _id: decoded.sub }] 
    });
    if (!user) throw new Error("User not found");

    const accessToken = jwt.sign(
      { sub: user.anonymous_id || user._id.toString(), role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY as any }
    );

    return { accessToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

/**
 * Verify a JWT and return the payload.
 */
export function verifyJWT(token: string): { sub: string; role: string } {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string };
}
