import "./Lesson.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "../../components/Preloader/Preloader.jsx";

export default function Lesson() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = Cookies.get("id");
  const { lessonId } = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonResponse = await axios.get(
          `http://localhost:5000/api/lessons/details/${lessonId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setLesson(lessonResponse.data);
        console.log(lessonResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLesson().finally(() => setLoading(false));
  }, [lessonId]);

  return loading ? (
    <Preloader />
  ) : (
    <div className="lesson-container">
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="lesson-description">{lesson.description}</p>
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      {userId === lesson.course.instructor ? (
        <Link to={`/course/${lesson.course._id}/lesson/${lesson._id}/edit`}>
          <button>Edit Lesson</button>
        </Link>
      ) : null}
      {lesson.quiz ? (
        userId === lesson.course.instructor ? (
          <Link
            to={`/course/${lesson.course._id}/lesson/${lesson._id}/quiz/${lesson.quiz}/edit`}
          >
            <button>Edit Quiz</button>
          </Link>
        ) : (
          <Link
            to={`/course/${lesson.course._id}/lesson/${lesson._id}/quiz/${lesson.quiz}`}
          >
            <button>Quiz</button>
          </Link>
        )
      ) : userId === lesson.course.instructor ? (
        <Link
          to={`/course/${lesson.course._id}/lesson/${lesson._id}/create-quiz`}
        >
          <button>Create Quiz</button>
        </Link>
      ) : null}
    </div>
  );
}
