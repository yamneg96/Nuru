import { logger } from "../../../utils/logger.js";

const MAX_MESSAGES_PER_WINDOW = 30;
const WINDOW_MS = 60 * 1000; // 1 minute

interface RateBucket {
  count: number;
  windowStart: number;
}

class MessageRateLimiter {
  private buckets = new Map<string, RateBucket>();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupTimer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  isAllowed(userId: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(userId);

    if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
      bucket = { count: 0, windowStart: now };
      this.buckets.set(userId, bucket);
    }

    bucket.count++;

    if (bucket.count > MAX_MESSAGES_PER_WINDOW) {
      logger.warn({ userId, count: bucket.count }, "Rate limit exceeded");
      return false;
    }

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [userId, bucket] of this.buckets) {
      if (now - bucket.windowStart >= WINDOW_MS * 2) {
        this.buckets.delete(userId);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupTimer);
    this.buckets.clear();
  }
}

export const rateLimiter = new MessageRateLimiter();
