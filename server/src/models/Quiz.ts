import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IQuestion {
  text: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  module_id?: Types.ObjectId;
  title: string;
  description?: string;
  questions: IQuestion[];
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct_index: { type: Number, required: true },
  explanation: { type: String },
});

const QuizSchema = new Schema<IQuiz>({
  module_id: { type: Schema.Types.ObjectId, ref: "Module", index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  questions: [QuestionSchema],
  published: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Auto-update updated_at
QuizSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
