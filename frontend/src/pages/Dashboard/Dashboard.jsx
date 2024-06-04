import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Preloader from "../../components/Preloader/Preloader.jsx";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
    setLoading(false);
  }, []);

  return loading ? (
    <Preloader />
  ) : (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <h2>Your Courses</h2>
      <div className={"course-items"}>
        {courses.map((course) => (
          <div key={course._id} className={"course-item-card"}>
            <Link to={`/courses/${course._id}`}>
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
              <p>${course.price}</p>
              <Link to={`/course/${course._id}/create-lesson`}>
                <button>Add Lesson</button>
              </Link>
              <p>{course.visible}</p>
            </Link>
          </div>
        ))}
      </div>
      <Link to="/create-course">
        <button>New course</button>
      </Link>
    </div>
  );
}
