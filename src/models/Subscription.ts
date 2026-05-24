import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  email: string;
  name?: string;
  isActive: boolean;
  frequency: "daily" | "weekly" | "monthly";
  categories: string[];
  verified: boolean;
  unsubscribeToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    email: { type: String, required: true },
    name: String,
    isActive: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    categories: [String],
    verified: { type: Boolean, default: false },
    unsubscribeToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
