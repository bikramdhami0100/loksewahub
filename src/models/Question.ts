import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  question: string;
  questionNe?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  explanationNe?: string;
  type: "mcq" | "descriptive" | "short-answer" | "one-liner";
  subject: string;
  examType: string;
  year?: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  isPublished: boolean;
  source: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    questionNe: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    explanationNe: String,
    type: {
      type: String,
      enum: ["mcq", "descriptive", "short-answer", "one-liner"],
      required: true,
    },
    subject: { type: String, required: true },
    examType: {
      type: String,
      enum: ["loksewa", "tsc", "provincial", "banking", "security", "other"],
      required: true,
    },
    year: Number,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    source: { type: String, default: "manual" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

QuestionSchema.index({ subject: 1, examType: 1, year: -1 });
QuestionSchema.index({ type: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ question: "text" });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
