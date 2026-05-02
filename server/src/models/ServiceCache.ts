import mongoose, { Schema, type Document } from "mongoose";

export interface IServiceCache extends Document {
  location_key: string; // "lat_lng" rounded to 2 decimal places
  type: string;
  results: any[];
  expires_at: Date;
}

const ServiceCacheSchema = new Schema<IServiceCache>({
  location_key: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  results: { type: Schema.Types.Mixed, required: true },
  expires_at: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
});

export const ServiceCache = mongoose.model<IServiceCache>("ServiceCache", ServiceCacheSchema);
