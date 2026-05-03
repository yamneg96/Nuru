import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { Event } from "../models/Event.js";
import { Video } from "../models/Video.js";
import { Feedback } from "../models/Feedback.js";

export async function getPublicMetrics() {
  const [totalUsers, activeUsers, totalQuestions, totalEvents, upcomingEvents, featuredVideos, testimonials] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({
      last_active: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    ChatLog.countDocuments(),
    Event.countDocuments(),
    Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3)
      .select("title date location_name type category is_online _id")
      .lean(),
    Video.find({ published: true })
      .sort({ order: 1, created_at: -1 })
      .limit(3)
      .select("title duration thumbnail_url source_url _id")
      .lean(),
    Feedback.find({ is_public: true, rating: { $gte: 4 }, comment: { $ne: "" } })
      .sort({ created_at: -1 })
      .limit(10)
      .select("rating comment user_age user_type context created_at _id")
      .lean()
  ]);

  return {
    total_users: totalUsers,
    active_users: activeUsers,
    total_questions: totalQuestions,
    total_events: totalEvents,
    upcoming_events: upcomingEvents,
    featured_videos: featuredVideos,
    testimonials: testimonials
  };
}
