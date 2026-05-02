import mongoose, { Schema, type Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  user_id: mongoose.Types.ObjectId;
  anonymous_id: string; // We use this as the primary identifier in JWT
  expires_at: Date;
  created_at: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  anonymous_id: { type: String, required: true },
  expires_at: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  created_at: { type: Date, default: Date.now },
});

export const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
