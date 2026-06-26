import mongoose, { Schema, InferSchemaType } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IIssue {
  line: number;
  column?: number | null;
  severity: "error" | "warning" | "info";
  category: string;
  message: string;
  suggestion?: string | null;
}

const reviewSchema = new Schema(
  {
    _id: { type: String, default: () => uuid() },
    code: { type: String, required: true },
    language: { type: String, required: true },
    title: { type: String, default: "" },
    overallScore: { type: Number, default: 0 },
    issues: {
      type: [
        {
          line: Number,
          column: { type: Number, default: null },
          severity: String,
          category: String,
          message: String,
          suggestion: { type: String, default: null },
        },
      ],
      default: [],
    },
    summary: { type: String, default: "" },
  },
  { _id: false, timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export type IReview = InferSchemaType<typeof reviewSchema> & { _id: string };

const commentSchema = new Schema(
  {
    _id: { type: String, default: () => uuid() },
    reviewId: { type: String, ref: "Review", required: true },
    author: { type: String, default: "Anonymous" },
    body: { type: String, required: true },
    lineNumber: { type: Number, default: null },
  },
  { _id: false, timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export type IComment = InferSchemaType<typeof commentSchema> & { _id: string };

export const Review = mongoose.model("Review", reviewSchema);
export const Comment = mongoose.model("Comment", commentSchema);
