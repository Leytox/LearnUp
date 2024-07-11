import { Schema, model } from "mongoose";

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ text: String, isCorrect: Boolean }],
});

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [QuestionSchema],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default model("Quiz", QuizSchema);
