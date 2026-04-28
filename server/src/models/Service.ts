import mongoose, { Schema, type Document } from "mongoose";

export interface IService extends Document {
  name: string;
  type: "clinic" | "pharmacy" | "counseling" | "hospital";
  address: string;
  area: string;
  distance: string;
  services: string[];
  tags: string[];
  verified: boolean;
  phone?: string;
  coordinates?: { lat: number; lng: number };
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  type: { type: String, enum: ["clinic", "pharmacy", "counseling", "hospital"], required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  distance: { type: String, default: "N/A" },
  services: [{ type: String }],
  tags: [{ type: String }],
  verified: { type: Boolean, default: false },
  phone: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

export const Service = mongoose.model<IService>("Service", ServiceSchema);
