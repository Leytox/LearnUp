// models/Enrollment.js
import { Schema, model } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    certificate: {
      type: String, // URL or path to the PDF certificate
      default: "",
    },
  },
  { timestamps: true }
);

export default model("Enrollment", EnrollmentSchema);
