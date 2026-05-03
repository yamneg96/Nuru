import mongoose, { Schema, type Document } from "mongoose";

export interface IFeedback extends Document {
  anonymous_id?: string;
  context: "video" | "chat" | "event" | "blog" | "decision" | "other";
  context_id?: string;
  rating?: number;
  comment: string;
  user_age?: number;
  user_type?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    anonymous_id: { type: String },
    context: { 
      type: String, 
      enum: ["video", "chat", "event", "blog", "decision", "other"], 
      default: "other" 
    },
    context_id: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, required: true },
    user_age: { type: Number },
    user_type: { type: String, default: "Youth" },
    is_public: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
