const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const PORT = process.env.PORT || 5000;

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
app.use("/api/categories", require("./routes/categories"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/enrollments/progress", require("./routes/progress"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/users", require("./routes/users"));
