import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IArticle extends Document {
  module_id: Types.ObjectId;
  title: string;
  slug: string;
  content_markdown: string;
  summary: string;
  badge: string;
  image_url: string;
  video_id: Types.ObjectId | null;
  order: number;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

const ArticleSchema = new Schema<IArticle>({
  module_id: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  content_markdown: { type: String, required: true },
  summary: { type: String, required: true },
  badge: { type: String, default: "" },
  image_url: { type: String, default: "" },
  video_id: { type: Schema.Types.ObjectId, ref: "Video", default: null },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ArticleSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

export const Article = mongoose.model<IArticle>("Article", ArticleSchema);
