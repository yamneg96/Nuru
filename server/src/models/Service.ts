import mongoose, { Schema, type Document } from "mongoose";

export interface IService extends Document {
  name: string;
  type: "clinic" | "pharmacy" | "counseling" | "hospital" | "youth_center";
  address: string;
  services: string[];
  tags: string[];
  verified: boolean;
  phone?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  type: { type: String, enum: ["clinic", "pharmacy", "counseling", "hospital", "youth_center"], required: true },
  address: { type: String, required: true },
  services: [{ type: String }],
  tags: [{ type: String }],
  verified: { type: Boolean, default: false },
  phone: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
});

ServiceSchema.index({ location: "2dsphere" });

export const Service = mongoose.model<IService>("Service", ServiceSchema);
