import mongoose, { Schema, Document } from "mongoose";

export interface IPublicReport extends Document {
  title: string;
  period: {
    from: Date;
    to: Date;
  };
  type: "monthly" | "quarterly" | "annual";
  metrics: {
    users_served: number;
    conversations_held: number;
    modules_completed: number;
    events_held: number;
    professionals_active: number;
    risk_assessments_completed: number;
    top_topics: string[];
  };
  summary_markdown: string;
  published: boolean;
  published_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PublicReportSchema = new Schema<IPublicReport>(
  {
    title: { type: String, required: true },
    period: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    type: { type: String, enum: ["monthly", "quarterly", "annual"], required: true },
    metrics: {
      users_served: { type: Number, default: 0 },
      conversations_held: { type: Number, default: 0 },
      modules_completed: { type: Number, default: 0 },
      events_held: { type: Number, default: 0 },
      professionals_active: { type: Number, default: 0 },
      risk_assessments_completed: { type: Number, default: 0 },
      top_topics: [{ type: String }],
    },
    summary_markdown: { type: String, default: "" },
    published: { type: Boolean, default: false },
    published_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export const PublicReport = mongoose.model<IPublicReport>("PublicReport", PublicReportSchema);
