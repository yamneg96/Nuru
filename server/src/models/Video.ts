import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IVideo extends Document {
  module_id: Types.ObjectId;
  title: string;
  description: string;
  source_type: "youtube" | "local";
  source_url: string;
  thumbnail_url: string;
  duration: string;
  order: number;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    module_id: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    source_type: { type: String, enum: ["youtube", "local"], default: "youtube" },
    source_url: { type: String, required: true },
    thumbnail_url: { type: String, default: "" },
    duration: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Helper to extract YouTube ID
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

VideoSchema.virtual("youtube_id").get(function () {
  if (this.source_type !== "youtube") return null;
  return getYouTubeId(this.source_url);
});

VideoSchema.virtual("embed_url").get(function () {
  if (this.source_type !== "youtube") return this.source_url;
  const id = getYouTubeId(this.source_url);
  return id ? `https://www.youtube.com/embed/${id}` : this.source_url;
});

VideoSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

export const Video = mongoose.model<IVideo>("Video", VideoSchema);
