import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";

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
          `http://localhost:5000/api/courses/instructor/${Cookies.get("id")}`,
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
    <div className="dashboard-container">
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
          <div key={course._id} className={"course-item-card"}>
            <Link
              to={`/courses/${course._id}`}
              className={"course-item-card-link"}
            >
              <img
                src={
                  course.picture
                    ? `http://localhost:5000/${course.picture}`
                    : "https://cdn.shopify.com/s/files/1/0070/5901/3716/files/coding_background.jpg?v=1688538955"
                }
                alt={course.title}
                style={{ width: "200px" }}
              />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <i>
                  <strong>{course.category}</strong>
                </i>
              </p>
              <p>${course.price}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`/course/${course._id}/create-lesson`}>
                  <button>
                    <FontAwesomeIcon icon={faPlus} /> Add Lesson
                  </button>
                </Link>
                <Link to={`/course/${course._id}/edit`}>
                  <button>
                    <FontAwesomeIcon icon={faPen} /> Edit Course
                  </button>
                </Link>
              </div>
              <p>{course.visible}</p>
            </Link>
          </div>
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
