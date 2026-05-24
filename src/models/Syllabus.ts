import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISyllabus extends Document {
  title: string;
  titleNe?: string;
  examType: string;
  organization: string;
  description: string;
  descriptionNe?: string;
  topics: Array<{
    name: string;
    nameNe?: string;
    subtopics: string[];
    weightage?: number;
  }>;
  pdfUrl?: string;
  fileAssetId?: mongoose.Types.ObjectId;
  examLevel: "primary" | "secondary" | "officer" | "specialist" | "other";
  isActive: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SyllabusSchema = new Schema<ISyllabus>(
  {
    title: { type: String, required: true },
    titleNe: String,
    examType: {
      type: String,
      enum: ["loksewa", "tsc", "provincial", "banking", "security", "other"],
      required: true,
    },
    organization: { type: String, required: true },
    description: String,
    descriptionNe: String,
    topics: [
      {
        name: { type: String, required: true },
        nameNe: String,
        subtopics: [String],
        weightage: Number,
      },
    ],
    pdfUrl: String,
    fileAssetId: { type: Schema.Types.ObjectId, ref: "FileAsset" },
    examLevel: {
      type: String,
      enum: ["primary", "secondary", "officer", "specialist", "other"],
      default: "other",
    },
    isActive: { type: Boolean, default: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

SyllabusSchema.index({ examType: 1, organization: 1 });
SyllabusSchema.index({ title: "text", description: "text" });

const Syllabus: Model<ISyllabus> =
  mongoose.models.Syllabus || mongoose.model<ISyllabus>("Syllabus", SyllabusSchema);
export default Syllabus;
