import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!Cookies.get("token") && Cookies.get("role") !== "instructor") {
      setRedirect(true);
      return;
    }
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/instructor/${Cookies.get("id")}`,
          {
            headers: {
              instructorId: Cookies.get("id"),
            },
          },
        );
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      }
    };
    fetchCourses().finally(() => setLoading(false));
  }, []);

  if (redirect) navigate("/");

  return loading ? (
    <Preloader />
  ) : (
    <div className="dashboard-container main-wrapper">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="dashboard-title">Dashboard</h1>
      {courses.length === 0 && (
        <div className={"courses-empty"}>
          <h3>No courses found</h3>
        </div>
      )}
      <div className={"course-items"}>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course}>
            <Link to={`/course/${course._id}/edit`}>
              <button>
                <FontAwesomeIcon icon={faPen} /> Edit Course
              </button>
            </Link>
            <Link to={`/course/${course._id}/create-lesson`}>
              <button>
                <FontAwesomeIcon icon={faPlus} /> Add Lesson
              </button>
            </Link>
          </CourseCard>
        ))}
      </div>
      <Link to="/create-course">
        <button>
          <FontAwesomeIcon icon={faPlus} /> New course
        </button>
      </Link>
    </div>
  );
}
