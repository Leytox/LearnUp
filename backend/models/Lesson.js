import { Schema, model } from "mongoose";

const LessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export default model("Lesson", LessonSchema);
