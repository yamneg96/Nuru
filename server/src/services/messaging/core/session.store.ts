import type { Language, Platform, UserSession } from "../shared/constants.js";
import { DEFAULT_LANGUAGE } from "../shared/constants.js";
import { logger } from "../../../utils/logger.js";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

interface SessionStore {
  get(userId: string): UserSession | undefined;
  getOrCreate(userId: string, platform: Platform): UserSession;
  setLanguage(userId: string, lang: Language): void;
  touch(userId: string): void;
  delete(userId: string): void;
  size(): number;
}

class InMemorySessionStore implements SessionStore {
  private sessions = new Map<string, UserSession>();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupTimer = setInterval(() => this.evictStale(), CLEANUP_INTERVAL_MS);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  get(userId: string): UserSession | undefined {
    return this.sessions.get(userId);
  }

  getOrCreate(userId: string, platform: Platform): UserSession {
    let session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = Date.now();
      return session;
    }

    session = {
      userId,
      platform,
      lang: DEFAULT_LANGUAGE,
      lastActivity: Date.now(),
      messageCount: 0,
    };

    this.sessions.set(userId, session);
    logger.debug({ userId, platform }, "Session created");
    return session;
  }

  setLanguage(userId: string, lang: Language): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.lang = lang;
      session.lastActivity = Date.now();
      logger.info({ userId, lang }, "Language preference updated");
    }
  }

  touch(userId: string): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = Date.now();
      session.messageCount += 1;
    }
  }

  delete(userId: string): void {
    this.sessions.delete(userId);
  }

  size(): number {
    return this.sessions.size;
  }

  private evictStale(): void {
    const now = Date.now();
    let evicted = 0;

    for (const [userId, session] of this.sessions) {
      if (now - session.lastActivity > SESSION_TTL_MS) {
        this.sessions.delete(userId);
        evicted++;
      }
    }

    if (evicted > 0) {
      logger.info({ evicted, remaining: this.sessions.size }, "Stale sessions evicted");
    }
  }

  destroy(): void {
    clearInterval(this.cleanupTimer);
    this.sessions.clear();
  }
}

export const sessionStore: SessionStore = new InMemorySessionStore();
