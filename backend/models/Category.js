// models/Category.js
import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  picture: { type: String, default: "" },
});

export default model("Category", CategorySchema);
