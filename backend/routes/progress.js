const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Quiz = require("../models/Quiz");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const Course = require("../models/Course");
const { PDFDocument, rgb } = require("pdf-lib");
const path = require("path");
const fs = require("fs");

const certificatesDir = path.join(
  __dirname,
  "..",
  "uploads",
  "users_certificates",
);

if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

// Function to generate PDF certificate
async function generateCertificate(userName, courseTitle) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const fontSize = 30;
  const textColor = rgb(0, 0, 0);

  page.drawText("Certificate of Completion", {
    x: 50,
    y: 700,
    size: fontSize,
    color: textColor,
  });

  page.drawText(`This certifies that`, {
    x: 50,
    y: 650,
    size: fontSize - 10,
    color: textColor,
  });

  page.drawText(userName, {
    x: 50,
    y: 600,
    size: fontSize,
    color: textColor,
  });

  page.drawText(`has successfully completed the course`, {
    x: 50,
    y: 550,
    size: fontSize - 10,
    color: textColor,
  });

  page.drawText(courseTitle, {
    x: 50,
    y: 500,
    size: fontSize,
    color: textColor,
  });

  page.drawText(`on ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 450,
    size: fontSize - 10,
    color: textColor,
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(
    certificatesDir,
    `${userName}_${courseTitle}.pdf`.trim(),
  );
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

// Complete quiz and possibly generate certificate
router.post("/complete-quiz", auth, async (req, res) => {
  const { userId, quizId, courseId } = req.body;
  try {
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    if (!enrollment)
      return res.status(404).send({ error: "Enrollment not found" });
    if (!enrollment.completedQuizzes.includes(quizId)) {
      enrollment.completedQuizzes.push(quizId);
      const totalQuizzes = await Quiz.countDocuments({ course: courseId });
      const completedQuizzes = enrollment.completedQuizzes.length;
      if (enrollment.certificate)
        return res.status(200).send(enrollment.certificate);
      enrollment.progress = (completedQuizzes / totalQuizzes) * 100;
      if (enrollment.progress === 100 && enrollment.certificate === "") {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        enrollment.certificate = await generateCertificate(
          user.name,
          course.title,
        );
      }
      await enrollment.save();
    }
    res.status(200).send(enrollment);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
    console.error(error);
  }
});

// Get certificate
router.get("/certificate/:userId/:courseId", auth, async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    if (enrollment.certificate) {
      res.status(200).send(enrollment.certificate);
    } else {
      if (enrollment.progress === 100) {
        enrollment.certificate = await generateCertificate(
          enrollment.student.name,
          enrollment.course.title,
        );
        await enrollment.save();
        res.status(200).send(enrollment.certificate);
      } else res.status(404).json({ error: "Certificate not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get progress
router.get("/user/:userId/course/:courseId", auth, async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    res.status(200).json(enrollment.progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
