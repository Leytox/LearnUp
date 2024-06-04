import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import "./Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="courses-container">
      <Helmet>
        <title>Courses</title>
      </Helmet>
      <h1>Courses</h1>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
