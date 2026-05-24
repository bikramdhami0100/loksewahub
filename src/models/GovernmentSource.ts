import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGovernmentSource extends Document {
  name: string;
  url: string;
  type: "exam-authority" | "ministry" | "security" | "news" | "portal";
  category: string;
  isActive: boolean;
  scrapeInterval: number;
  lastScraped?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GovernmentSourceSchema = new Schema<IGovernmentSource>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["exam-authority", "ministry", "security", "news", "portal"],
      required: true,
    },
    category: String,
    isActive: { type: Boolean, default: true },
    scrapeInterval: { type: Number, default: 3600000 },
    lastScraped: Date,
  },
  { timestamps: true }
);

const GovernmentSource: Model<IGovernmentSource> =
  mongoose.models.GovernmentSource ||
  mongoose.model<IGovernmentSource>("GovernmentSource", GovernmentSourceSchema);
export default GovernmentSource;
