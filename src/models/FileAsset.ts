import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFileAsset extends Document {
  publicId: string;
  secureUrl: string;
  format: string;
  bytes: number;
  folder: string;
  originalName: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const FileAssetSchema = new Schema<IFileAsset>(
  {
    publicId: { type: String, required: true, unique: true },
    secureUrl: { type: String, required: true },
    format: String,
    bytes: Number,
    folder: { type: String, required: true },
    originalName: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const FileAsset: Model<IFileAsset> =
  mongoose.models.FileAsset || mongoose.model<IFileAsset>("FileAsset", FileAssetSchema);
export default FileAsset;
