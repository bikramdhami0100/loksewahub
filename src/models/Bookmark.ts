import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  itemType: "note" | "syllabus" | "question" | "notice" | "current-affair";
  itemId: mongoose.Types.ObjectId;
  label?: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemType: {
      type: String,
      enum: ["note", "syllabus", "question", "notice", "current-affair"],
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    label: String,
  },
  { timestamps: true }
);

BookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
export default Bookmark;
