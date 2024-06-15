const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");

async function addQuiz(req, res) {
  const { title, description, questions, course, lesson } = req.body;
  try {
    const lessonObj = await Lesson.findById(lesson);
    if (!lessonObj) res.status(404).send("Lesson not found");
    const quiz = new Quiz({
      title,
      description,
      questions,
      course,
      lesson: lessonObj._id,
    });
    await quiz.save();
    if (!quiz._id) res.status(500).send("Error saving quiz");
    lessonObj.quiz = quiz._id;
    await lessonObj.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function updateQuiz(req, res) {
  const { title, description, questions } = req.body;
  try {
    const quiz = await Quiz.findById(req.params.quizzId);
    quiz.title = title;
    quiz.description = description;
    quiz.questions = questions;
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getQuiz(req, res) {
  try {
    const { quizzId } = req.params;
    const quizzes = await Quiz.findById(quizzId);
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getQuizzesForCourse(req, res) {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = { addQuiz, updateQuiz, getQuiz, getQuizzesForCourse };
