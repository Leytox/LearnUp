const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB().then(() =>
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/search", require("./routes/search"));
app.use("/api/reviews", require("./routes/reviews"));

const PORT = process.env.PORT || 5000;
