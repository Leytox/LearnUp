import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

async function createLesson(req, res) {
  const { course, title, description, content } = req.body;
  try {
    if (req.user.role !== "admin") {
      const courseObj = await Lesson.findById(course);
      if (!courseObj) return res.status(404).json({ msg: "Course not found" });
      if (courseObj.instructor.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });
    }
    const lesson = new Lesson({
      course,
      title,
      description,
      content,
    });
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function updateLesson(req, res) {
  const { course, title, description, content } = req.body;
  try {
    if (req.user.role !== "admin") {
      const courseObj = await Lesson.findById(course);
      if (!courseObj) return res.status(404).json({ msg: "Course not found" });
      if (courseObj.instructor.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });
    }
    let lesson = await Lesson.findById(req.params.lessonId).populate(
      "course",
      "instructor"
    );
    if (!lesson) return res.status(404).json({ msg: "Lesson not found" });
    console.log(lesson);
    // Check user permission
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(401).json({ msg: "User not authorized" });

    lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, {
      title,
      description,
      content,
      updatedAt: Date.now(),
    });

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getLessonById(req, res) {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate(
      "course",
      "instructor"
    );
    if (!lesson) return res.status(404).json({ msg: "Lesson not found" });
    return res.status(200).json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getLessonsForCourse(req, res) {
  try {
    const lessons = await Course.find({ course: req.params.courseId }).select(
      "-content"
    );
    res.json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default {
  createLesson,
  updateLesson,
  getLessonById,
  getLessonsForCourse,
};
