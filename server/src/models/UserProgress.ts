import mongoose, { Schema, type Document, type Types } from "mongoose";

export type ContentType = "article" | "video" | "quiz";

export interface IUserProgress extends Document {
  user_id: Types.ObjectId;
  content_type: ContentType;
  content_id: Types.ObjectId;
  module_id?: Types.ObjectId;
  // Quiz-specific
  quiz_score?: number;
  quiz_total?: number;
  quiz_passed?: boolean;
  completed_at: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content_type: { type: String, enum: ["article", "video", "quiz"], required: true },
  content_id: { type: Schema.Types.ObjectId, required: true },
  module_id: { type: Schema.Types.ObjectId, ref: "Module" },
  // Quiz fields (populated when content_type === 'quiz')
  quiz_score: { type: Number },
  quiz_total: { type: Number },
  quiz_passed: { type: Boolean },
  completed_at: { type: Date, default: Date.now },
});

// One completion record per user per content item (upsertable)
UserProgressSchema.index({ user_id: 1, content_type: 1, content_id: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);
