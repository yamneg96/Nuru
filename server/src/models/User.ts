import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  anonymous_id?: string; // Optional for admins
  email_hash?: string; // Optional for admins
  email?: string; // Raw email for admins
  name?: string; // Full name
  password_hash?: string; // Only for admins
  role: "user" | "admin" | "super_admin";
  created_at: Date;
  last_active: Date;
  preferences: {
    language: "english" | "amharic" | "oromo";
    save_history: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  anonymous_id: { type: String, unique: true, index: true, sparse: true },
  email_hash: { type: String, unique: true, index: true, sparse: true },
  email: { type: String, unique: true, index: true, sparse: true },
  name: { type: String, trim: true },
  password_hash: { type: String },
  role: { type: String, enum: ["user", "admin", "super_admin"], default: "user" },
  created_at: { type: Date, default: Date.now },
  last_active: { type: Date, default: Date.now },
  preferences: {
    language: { type: String, enum: ["english", "amharic", "oromo"], default: "english" },
    save_history: { type: Boolean, default: true },
  },
});

// NEVER expose email_hash or internals to API responses
UserSchema.methods.toSafeJSON = function () {
  return {
    id: this.role !== "user" ? this._id : this.anonymous_id,
    role: this.role,
    email: this.email,
    name: this.name,
    created_at: this.created_at,
    last_active: this.last_active,
    preferences: this.preferences,
  };
};

export const User = mongoose.model<IUser>("User", UserSchema);
