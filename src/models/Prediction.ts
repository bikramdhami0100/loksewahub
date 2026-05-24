import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrediction extends Document {
  examType: string;
  subject: string;
  predictions: Array<{
    question: string;
    confidence: number;
    reason: string;
  }>;
  generatedBy: mongoose.Types.ObjectId;
  generatedAt: Date;
  sourceData: {
    recentQuestions: number;
    notesAnalyzed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    examType: {
      type: String,
      enum: ["loksewa", "tsc", "provincial", "banking", "security", "other"],
      required: true,
    },
    subject: { type: String, required: true },
    predictions: [
      {
        question: { type: String, required: true },
        confidence: { type: Number, required: true },
        reason: String,
      },
    ],
    generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    generatedAt: { type: Date, default: Date.now },
    sourceData: {
      recentQuestions: Number,
      notesAnalyzed: Number,
    },
  },
  { timestamps: true }
);

const Prediction: Model<IPrediction> =
  mongoose.models.Prediction ||
  mongoose.model<IPrediction>("Prediction", PredictionSchema);
export default Prediction;
