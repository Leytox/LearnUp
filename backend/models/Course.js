import { Schema, model } from "mongoose";
const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
      default: "Beginner",
    },
    price: { type: Number, required: true },
    available: { type: Boolean, required: false, default: false },
    picture: { type: String, required: false },
  },
  { timestamps: true }
);

CourseSchema.index({ title: "text", description: "text", category: "text" });

export default model("Course", CourseSchema);
