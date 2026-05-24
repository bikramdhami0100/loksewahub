import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer?: string;
  isCorrect: boolean;
  marksObtained: number;
  timeTaken: number;
}

export interface IAttempt extends Document {
  user: mongoose.Types.ObjectId;
  mockTest: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeTaken: number;
  rank?: number;
  percentile?: number;
  completedAt?: Date;
  status: "in-progress" | "completed" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mockTest: { type: Schema.Types.ObjectId, ref: "MockTest", required: true },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: String,
        isCorrect: { type: Boolean, default: false },
        marksObtained: { type: Number, default: 0 },
        timeTaken: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    rank: Number,
    percentile: Number,
    completedAt: Date,
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

AttemptSchema.index({ user: 1, mockTest: 1 });
AttemptSchema.index({ mockTest: 1, score: -1 });

const Attempt: Model<IAttempt> =
  mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);
export default Attempt;
