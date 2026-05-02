import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  
  type: "workshop" | "talk" | "gathering" | "webinar" | "other";
  category: "health" | "career" | "social" | "education";
  
  date: Date;
  location_name: string;
  is_online: boolean;
  meeting_link: string | null;
  
  organizer: string;
  
  max_attendees: number | null;
  attendee_count: number;
  
  registered_users: string[]; // List of anonymous_ids
  
  image_url: string | null;
  
  created_at: Date;
  updated_at: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  type: { 
    type: String, 
    enum: ["workshop", "talk", "gathering", "webinar", "other"], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ["health", "career", "social", "education"], 
    required: true 
  },
  
  date: { type: Date, required: true, index: true },
  location_name: { type: String, required: true },
  is_online: { type: Boolean, default: false },
  meeting_link: { type: String, default: null },
  
  organizer: { type: String, required: true },
  
  max_attendees: { type: Number, default: null },
  attendee_count: { type: Number, default: 0 },
  
  registered_users: [{ type: String }], // Store anonymous_ids for community events
  
  image_url: { type: String, default: null },
}, { 
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" } 
});

export const Event = mongoose.model<IEvent>("Event", EventSchema);
