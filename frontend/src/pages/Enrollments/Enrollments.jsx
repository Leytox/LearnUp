import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import Preloader from "../../components/Preloader/Preloader.jsx";
import "./Enrollments.css";

export default function Enrollments() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/enrollments/my-courses",
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setEnrolledCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnrolledCourses().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Preloader />
  ) : (
    <div className={"enrollmentsContainer"}>
      <h1>Enrollments</h1>
      <div className={"enrolled-courses-container"}>
        {enrolledCourses.map((enrolled) => (
          <CourseCard
            key={enrolled.course._id}
            course={enrolled.course}
            className={"courseCard"}
          >
            <p>Progress: {enrolled.progress}%</p>
          </CourseCard>
        ))}
      </div>
    </div>
  );
}
