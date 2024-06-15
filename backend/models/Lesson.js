const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lesson", LessonSchema);
