const Enrollment = require("../models/Enrollment");
const Quiz = require("../models/Quiz");
const generateCertificate = require("../utils/certificate");

async function completeQuiz(req, res) {
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
      await enrollment.save();
    }
    res.status(200).send(enrollment);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
    console.error(error);
  }
}

async function getCertificate(req, res) {
  const { userId, courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    })
      .populate("student", "name")
      .populate("course", "title");
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    if (enrollment.certificate) {
      res.status(200).send(enrollment.certificate);
    } else {
      if (enrollment.progress === 100) {
        enrollment.certificate = await generateCertificate(
          enrollment.student.name,
          enrollment.course.title,
          enrollment.course._id,
        );
        await enrollment.save();
        res.status(200).send(enrollment.certificate);
      } else res.status(404).json({ error: "Certificate not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

async function getProgress(req, res) {
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
}

module.exports = { completeQuiz, getCertificate, getProgress };
