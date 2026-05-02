import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IProfessional extends Document {
  user_id: Types.ObjectId | null;
  
  // Identity
  full_name: string;
  email: string;
  phone: string;
  photo_url: string;
  bio: string;
  
  // Classification
  type: "medical" | "counselor" | "therapist" | "psychiatrist" | "trainer" | "content_creator" | "influencer";
  specializations: string[];
  
  // Credentials
  license_number: string | null;
  institution: string;
  years_of_experience: number;
  
  // Availability
  availability: {
    online: boolean;
    offline: boolean;
    schedule: string | null;
  };
  
  // Location
  city: string;
  region: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  } | null;
  
  // Social Links
  social_links: {
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    telegram: string | null;
    linkedin: string | null;
  };
  
  // Status
  verification_status: "pending" | "verified" | "rejected";
  verified_by: Types.ObjectId | null;
  verified_at: Date | null;
  is_active: boolean;
  
  // Engagement
  events_participated: number;
  sessions_completed: number;
  rating: number;
  rating_count: number;
  
  created_at: Date;
  updated_at: Date;
}

const ProfessionalSchema = new Schema<IProfessional>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
  
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  photo_url: { type: String, default: "" },
  bio: { type: String, required: true, maxlength: 500 },
  
  type: { 
    type: String, 
    enum: ["medical", "counselor", "therapist", "psychiatrist", "trainer", "content_creator", "influencer"],
    required: true 
  },
  specializations: [{ type: String }],
  
  license_number: { type: String, default: null },
  institution: { type: String, required: true },
  years_of_experience: { type: Number, required: true, min: 0 },
  
  availability: {
    online: { type: Boolean, default: false },
    offline: { type: Boolean, default: false },
    schedule: { type: String, default: null },
  },
  
  city: { type: String, required: true },
  region: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  
  social_links: {
    instagram: { type: String, default: null },
    tiktok: { type: String, default: null },
    youtube: { type: String, default: null },
    telegram: { type: String, default: null },
    linkedin: { type: String, default: null },
  },
  
  verification_status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  verified_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  verified_at: { type: Date, default: null },
  is_active: { type: Boolean, default: true },
  
  events_participated: { type: Number, default: 0 },
  sessions_completed: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },
}, { 
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" } 
});

// Indices
ProfessionalSchema.index({ "coordinates": "2dsphere" });
ProfessionalSchema.index({ type: 1, verification_status: 1 });

export const Professional = mongoose.model<IProfessional>("Professional", ProfessionalSchema);
