import "./Lesson.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "../../components/Preloader/Preloader.jsx";

export default function Lesson() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.log(lessonResponse.data);
        setLesson(lessonResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchLesson();
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
    </div>
  );
}
