import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  provider: string;
  providerId: string;
  role: "user" | "admin" | "superadmin";
  subscriptionTier: "free" | "basic" | "premium" | "enterprise";
  subscriptionExpiry?: Date;
  emailNotifications: boolean;
  preferredLanguage: "en" | "ne";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    provider: { type: String, default: "google" },
    providerId: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    subscriptionTier: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"],
      default: "free",
    },
    subscriptionExpiry: Date,
    emailNotifications: { type: Boolean, default: true },
    preferredLanguage: { type: String, enum: ["en", "ne"], default: "en" },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
