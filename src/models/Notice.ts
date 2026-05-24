import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
  title: string;
  titleNe?: string;
  description: string;
  descriptionNe?: string;
  category: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  publishedDate: Date;
  deadline?: Date;
  examDate?: Date;
  organization: string;
  positions?: number;
  applyLink?: string;
  attachments: Array<{
    title: string;
    url: string;
  }>;
  content: string;
  summary?: string;
  summaryNe?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  scrapedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    titleNe: String,
    description: String,
    descriptionNe: String,
    category: {
      type: String,
      enum: [
        "vacancy",
        "result",
        "exam-schedule",
        "interview",
        "admit-card",
        "syllabus",
        "circular",
        "other",
      ],
      required: true,
    },
    source: { type: String, required: true },
    sourceUrl: String,
    originalUrl: { type: String, required: true, unique: true },
    publishedDate: { type: Date, required: true },
    deadline: Date,
    examDate: Date,
    organization: String,
    positions: Number,
    applyLink: String,
    attachments: [
      {
        title: String,
        url: String,
      },
    ],
    content: { type: String, default: "" },
    summary: String,
    summaryNe: String,
    tags: [String],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    scrapedAt: Date,
  },
  { timestamps: true }
);

NoticeSchema.index({ category: 1, publishedDate: -1 });
NoticeSchema.index({ source: 1 });
NoticeSchema.index({ tags: 1 });
NoticeSchema.index({ title: "text", description: "text" });

const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
export default Notice;
