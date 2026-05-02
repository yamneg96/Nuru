import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IAppointment extends Document {
  user_id: Types.ObjectId;
  professional_id: Types.ObjectId;
  
  status: "pending" | "confirmed" | "cancelled" | "completed";
  
  appointment_date: Date;
  duration_minutes: number;
  type: "online" | "offline";
  
  notes: string | null;
  
  // Feedback
  user_rating: number | null;
  user_review: string | null;
  
  // Metadata
  cancelled_by: "user" | "professional" | null;
  cancellation_reason: string | null;
  
  created_at: Date;
  updated_at: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  professional_id: { type: Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
  
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled", "completed"], 
    default: "pending",
    index: true
  },
  
  appointment_date: { type: Date, required: true },
  duration_minutes: { type: Number, default: 60 },
  type: { type: String, enum: ["online", "offline"], required: true },
  
  notes: { type: String, maxlength: 1000, default: null },
  
  user_rating: { type: Number, min: 1, max: 5, default: null },
  user_review: { type: String, maxlength: 500, default: null },
  
  cancelled_by: { type: String, enum: ["user", "professional"], default: null },
  cancellation_reason: { type: String, default: null },
}, { 
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" } 
});

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
