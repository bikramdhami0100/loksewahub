import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMockTestQuestion {
  questionId: mongoose.Types.ObjectId;
  marks: number;
  negativeMarks: number;
}

export interface IMockTest extends Document {
  title: string;
  titleNe?: string;
  description: string;
  descriptionNe?: string;
  examType: string;
  subject: string;
  questions: IMockTestQuestion[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  difficulty: "easy" | "medium" | "hard";
  isPublished: boolean;
  isFree: boolean;
  createdBy: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  totalAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const MockTestSchema = new Schema<IMockTest>(
  {
    title: { type: String, required: true },
    titleNe: String,
    description: { type: String, required: true },
    descriptionNe: String,
    examType: {
      type: String,
      enum: ["loksewa", "tsc", "provincial", "banking", "security", "other"],
      required: true,
    },
    subject: { type: String, required: true },
    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        marks: { type: Number, default: 1 },
        negativeMarks: { type: Number, default: 0.25 },
      },
    ],
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, default: 40 },
    negativeMarking: { type: Boolean, default: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: Date,
    endDate: Date,
    totalAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MockTest: Model<IMockTest> =
  mongoose.models.MockTest || mongoose.model<IMockTest>("MockTest", MockTestSchema);
export default MockTest;
