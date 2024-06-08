// models/Enrollment.js
const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0, // percentage of course completed
      max: 100,
    },
    completedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    certificate: {
      type: String, // URL or path to the PDF certificate
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
