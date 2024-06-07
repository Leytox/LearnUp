// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  picture: { type: String, default: "" },
});

module.exports = mongoose.model("Category", CategorySchema);
