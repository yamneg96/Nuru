import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  anonymous_id: string;
  email_hash: string;
  created_at: Date;
  last_active: Date;
  preferences: {
    language: "english" | "amharic" | "oromo";
    save_history: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  anonymous_id: { type: String, required: true, unique: true, index: true },
  email_hash: { type: String, required: true, unique: true, index: true },
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
    anonymous_id: this.anonymous_id,
    created_at: this.created_at,
    last_active: this.last_active,
    preferences: this.preferences,
  };
};

export const User = mongoose.model<IUser>("User", UserSchema);
