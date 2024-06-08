import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import "./UserProfile.css";
import CourseCard from "../../../components/CourseCard/CourseCard.jsx";
import NotFound from "../../NotFound/NotFound.jsx";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:5000/api/users/${id}`,
        );
        const coursesResponse = await axios.get(
          `http://localhost:5000/api/courses/instructor/${id}`,
        );
        setUser(userResponse.data);
        setCourses(coursesResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserAndCourses().finally(() => setLoading(false));
  }, [id]);

  return loading ? (
    <Preloader />
  ) : user ? (
    <div>
      <div className="user-profile">
        <img
          className={"profile-picture"}
          src={
            user.profilePicture
              ? `http://localhost:5000/${user.profilePicture}`
              : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
          }
          alt={"profile picture"}
        />{" "}
        <h1>{user.name}</h1>
        <p>{user.username}</p>
        <p>{user.email}</p>
        <p>Joined: {new Date(user.createdAt).getFullYear()}</p>
        <p>{user.bio}</p>
      </div>
      {user.role === "instructor" && (
        <div className={"user-courses"}>
          <h2>{user.name}&#39;s Courses:</h2>
          <div className={"user-courses-list"}>
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <NotFound />
  );
}
