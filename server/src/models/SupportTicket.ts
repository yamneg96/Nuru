import mongoose, { Schema, type Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISupportTicketResponse {
  responderId?: mongoose.Types.ObjectId;
  responderName: string;
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  source: "web" | "telegram" | "whatsapp";
  name?: string;
  email?: string;
  subject: string;
  message: string;
  category: "general" | "medical" | "technical" | "escalation";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: mongoose.Types.ObjectId;
  responses: ISupportTicketResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketResponseSchema = new Schema<ISupportTicketResponse>(
  {
    responderId: { type: Schema.Types.ObjectId, ref: "Professional" },
    responderName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: {
      type: String,
      unique: true,
      default: () => `NRU-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    source: {
      type: String,
      enum: ["web", "telegram", "whatsapp"],
      default: "web",
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ["general", "medical", "technical", "escalation"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Professional" },
    responses: [supportTicketResponseSchema],
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.index({ ticketId: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ createdAt: -1 });

export const SupportTicket = mongoose.model<ISupportTicket>(
  "SupportTicket",
  supportTicketSchema
);
