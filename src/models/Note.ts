import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  title: string;
  titleNe?: string;
  description: string;
  descriptionNe?: string;
  subject: string;
  subjectNe?: string;
  examType: string;
  content: string;
  contentNe?: string;
  pdfUrl?: string;
  fileAssetId?: mongoose.Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  downloadCount: number;
  uploadedBy: mongoose.Types.ObjectId;
  language: "en" | "ne" | "both";
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    titleNe: String,
    description: { type: String, required: true },
    descriptionNe: String,
    subject: { type: String, required: true },
    subjectNe: String,
    examType: {
      type: String,
      enum: ["loksewa", "tsc", "provincial", "banking", "security", "other"],
      required: true,
    },
    content: { type: String, default: "" },
    contentNe: String,
    pdfUrl: String,
    fileAssetId: { type: Schema.Types.ObjectId, ref: "FileAsset" },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    language: { type: String, enum: ["en", "ne", "both"], default: "en" },
  },
  { timestamps: true }
);

NoteSchema.index({ subject: 1, examType: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ title: "text", description: "text" });

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
export default Note;
