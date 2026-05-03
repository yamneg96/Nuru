import { logger } from "../../../utils/logger.js";
import type { Platform } from "../shared/constants.js";

export interface EscalationRecord {
  userId: string;
  context: string;
  platform: Platform;
  timestamp: Date;
  status: "pending" | "assigned" | "resolved";
}

const escalationQueue: EscalationRecord[] = [];

export async function escalateToHuman(
  userId: string,
  context: string,
  platform?: Platform
): Promise<EscalationRecord> {
  const record: EscalationRecord = {
    userId,
    context,
    platform: platform ?? "web" as Platform,
    timestamp: new Date(),
    status: "pending",
  };

  try {
    escalationQueue.push(record);

    logger.info(
      {
        userId,
        platform: record.platform,
        context: context.substring(0, 100),
        queueSize: escalationQueue.length,
      },
      "Escalation triggered — user requesting professional support"
    );

    // TODO: Integrate with:
    // 1. SupportTicket MongoDB model for persistence
    // 2. Real-time notification to admin dashboard
    // 3. Email/SMS notification to on-call professional

    return record;
  } catch (err) {
    logger.error(err, "Escalation failed");
    throw err;
  }
}

export function getEscalationQueue(): readonly EscalationRecord[] {
  return escalationQueue;
}

export function getEscalationQueueSize(): number {
  return escalationQueue.length;
}