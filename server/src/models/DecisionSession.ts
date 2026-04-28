import mongoose, { Schema, type Document } from "mongoose";

export interface IDecisionStep {
  question_id: string;
  answer: string | string[];
  timestamp: Date;
}

export interface IDecisionSession extends Document {
  session_id: string;
  anonymous_id: string;
  flow_type: string;
  steps: IDecisionStep[];
  current_step: number;
  total_steps: number;
  risk_level?: "low" | "moderate" | "high";
  result?: {
    summary: string;
    advice: string[];
    next_steps: { title: string; description: string; icon: string; action: string; action_type: string }[];
    ai_explanation?: string;
  };
  completed: boolean;
  created_at: Date;
}

const DecisionStepSchema = new Schema<IDecisionStep>(
  {
    question_id: { type: String, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DecisionSessionSchema = new Schema<IDecisionSession>({
  session_id: { type: String, required: true, unique: true, index: true },
  anonymous_id: { type: String, required: true, index: true },
  flow_type: { type: String, required: true },
  steps: [DecisionStepSchema],
  current_step: { type: Number, default: 0 },
  total_steps: { type: Number, required: true },
  risk_level: { type: String, enum: ["low", "moderate", "high"] },
  result: { type: Schema.Types.Mixed },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const DecisionSession = mongoose.model<IDecisionSession>("DecisionSession", DecisionSessionSchema);
