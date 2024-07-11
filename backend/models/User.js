import { Schema, model } from "mongoose";
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    bio: { type: String, default: "Student of LearnUp" },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    },
    phoneNumber: { type: String, default: "", unique: true },
    isPhoneVerified: { type: Boolean, default: false },
    verificationCode: { type: Number },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);
export default model("User", UserSchema);
