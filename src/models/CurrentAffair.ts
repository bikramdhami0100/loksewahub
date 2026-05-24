import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICurrentAffair extends Document {
  title: string;
  titleNe?: string;
  content: string;
  contentNe?: string;
  summary: string;
  summaryNe?: string;
  category: string;
  source: string;
  sourceUrl: string;
  date: Date;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  mcqs: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CurrentAffairSchema = new Schema<ICurrentAffair>(
  {
    title: { type: String, required: true },
    titleNe: String,
    content: { type: String, required: true },
    contentNe: String,
    summary: { type: String, required: true },
    summaryNe: String,
    category: {
      type: String,
      enum: [
        "politics",
        "economy",
        "sports",
        "science",
        "international",
        "appointment",
        "budget",
        "disaster",
        "award",
        "other",
      ],
      required: true,
    },
    source: String,
    sourceUrl: String,
    date: { type: Date, required: true },
    tags: [String],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    mcqs: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      },
    ],
  },
  { timestamps: true }
);

CurrentAffairSchema.index({ date: -1 });
CurrentAffairSchema.index({ category: 1 });
CurrentAffairSchema.index({ tags: 1 });

const CurrentAffair: Model<ICurrentAffair> =
  mongoose.models.CurrentAffair ||
  mongoose.model<ICurrentAffair>("CurrentAffair", CurrentAffairSchema);
export default CurrentAffair;
