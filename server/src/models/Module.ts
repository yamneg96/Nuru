import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IModule extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "tertiary";
  order: number;
  featured: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, enum: ["primary", "secondary", "tertiary"], default: "primary" },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Auto-update updated_at
ModuleSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

export const Module = mongoose.model<IModule>("Module", ModuleSchema);
