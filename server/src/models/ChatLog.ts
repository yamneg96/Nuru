import mongoose, { Schema, type Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface IChatLog extends Document {
  anonymous_id: string;
  conversation_id: string;
  messages: IChatMessage[];
  created_at: Date;
  updated_at: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatLogSchema = new Schema<IChatLog>({
  anonymous_id: { type: String, required: true, index: true },
  conversation_id: { type: String, required: true, unique: true, index: true },
  messages: [ChatMessageSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ChatLogSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const ChatLog = mongoose.model<IChatLog>("ChatLog", ChatLogSchema);
