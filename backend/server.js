import express, { json, static as expressStatic } from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { config } from "dotenv";
import { join } from "path";
import bot from "./bot/telegramBot.js";
import authRouter from "./routes/auth.js";
import categoriesRouter from "./routes/categories.js";
import coursesRouter from "./routes/courses.js";
import lessonsRouter from "./routes/lessons.js";
import quizzesRouter from "./routes/quizzes.js";
import enrollmentsRouter from "./routes/enrollments.js";
import progressRouter from "./routes/progress.js";
import paymentsRouter from "./routes/payments.js";
import profileRouter from "./routes/profile.js";
import adminRouter from "./routes/admin.js";
import reviewsRouter from "./routes/reviews.js";
import cartRouter from "./routes/cart.js";
const PORT = process.env.PORT || 5000;
config();
const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(
  "/uploads",
  expressStatic(join(new URL(import.meta.url).pathname, "uploads"))
);
// Routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/enrollments/progress", progressRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/cart", cartRouter);

// Start the App
connectDB()
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.error(error));
