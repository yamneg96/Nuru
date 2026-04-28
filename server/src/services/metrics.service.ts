import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";

export async function getPublicMetrics() {
  const [totalUsers, activeUsers, totalQuestions] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({
      last_active: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    ChatLog.countDocuments(),
  ]);

  return {
    total_users: totalUsers,
    active_users: activeUsers,
    total_questions: totalQuestions,
  };
}
