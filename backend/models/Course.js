const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: false, default: false },
    picture: { type: String, required: false },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Course", CourseSchema);
