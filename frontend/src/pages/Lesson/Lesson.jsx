import "./Lesson.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import NotFound from "../NotFound/NotFound.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlaskVial,
  faPen,
  faPlus,
  faVial,
} from "@fortawesome/free-solid-svg-icons";

export default function Lesson() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const userId = Cookies.get("id");
  const { courseId, lessonId } = useParams();

  useEffect(() => {
    if (!userId) {
      setRedirect(true);
      return;
    }
    const fetchLesson = async () => {
      try {
        const lessonResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/lessons/details/${lessonId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setLesson(lessonResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLesson().finally(() => setLoading(false));
  }, [lessonId, userId]);

  if (redirect) navigate(`/courses/${courseId}`);

  return loading ? (
    <Preloader />
  ) : lesson ? (
    <div className="lesson-container main-wrapper">
      <Helmet>
        <title>Lesson</title>
      </Helmet>
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="lesson-description">{lesson.description}</p>
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      <div className={"lesson-buttons"}>
        {userId === lesson.course.instructor ? (
          <Link to={`/course/${lesson.course._id}/lesson/${lesson._id}/edit`}>
            <button>
              Edit Lesson <FontAwesomeIcon icon={faPen} />
            </button>
          </Link>
        ) : null}
        {lesson.quiz ? (
          userId === lesson.course.instructor ? (
            <Link
              to={`/course/${lesson.course._id}/lesson/${lesson._id}/quiz/${lesson.quiz}/edit`}
            >
              <button>
                Edit Quiz <FontAwesomeIcon icon={faFlaskVial} />
              </button>
            </Link>
          ) : (
            <Link
              to={`/course/${lesson.course._id}/lesson/${lesson._id}/quiz/${lesson.quiz}`}
            >
              <button>
                Quiz <FontAwesomeIcon icon={faVial} />
              </button>
            </Link>
          )
        ) : userId === lesson.course.instructor ? (
          <Link
            to={`/course/${lesson.course._id}/lesson/${lesson._id}/create-quiz`}
          >
            <button>
              Create Quiz <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
