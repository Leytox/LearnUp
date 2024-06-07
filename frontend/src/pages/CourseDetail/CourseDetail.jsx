import { useEffect, useState } from "react";
import axios from "axios";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { Link, useParams } from "react-router-dom";
import Accordion from "../../components/Accordion/Accordion.jsx";
import {
  faCartShopping,
  faPersonChalkboard,
  faVialCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CourseDetail.css";
import Cookies from "js-cookie";

export default function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
        );
        setCourse(courseResponse.data);
        const lessonsResponse = await axios.get(
          `http://localhost:5000/api/lessons/${courseId}`,
        );
        setLessons(lessonsResponse.data);
        const quizzesResponse = await axios.get(
          `http://localhost:5000/api/quizzes/${courseId}`,
        );
        setQuizzes(quizzesResponse.data);
        const instructorResponse = await axios.get(
          `http://localhost:5000/api/profile/${courseResponse.data.instructor._id}`,
        );
        setInstructor(instructorResponse.data);
        const reviews = await axios.get(
          `http://localhost:5000/api/reviews/${courseId}`,
        );
        setReviews(reviews.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);
  return loading ? (
    <Preloader />
  ) : (
    <div className="course-container">
      <div className={"course-details"}>
        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className={"course-content"}>
          <h2>Course Content:</h2>
          <h2 className="course-subtitle">
            Lessons <FontAwesomeIcon icon={faPersonChalkboard} />
          </h2>
          <div>
            {lessons.map((lesson, index) => (
              <Accordion key={index} title={lesson.title}>
                <p>{lesson.description}</p>
              </Accordion>
            ))}
          </div>
          <h2 className="course-subtitle">
            Quizzes <FontAwesomeIcon icon={faVialCircleCheck} />
          </h2>
          {quizzes.map((quiz, index) => (
            <Accordion key={index} title={quiz.title}>
              <p>{quiz.description}</p>
            </Accordion>
          ))}
        </div>
        {Cookies.get("token") ? (
          <Link to={""}>
            <button id={"buy-button"}>
              <FontAwesomeIcon icon={faCartShopping} /> Add to cart ($
              {course.price})
            </button>
          </Link>
        ) : (
          <Link to={"/login"}>
            <button>
              {" "}
              Log in to buy ($
              {course.price})
            </button>
          </Link>
        )}
        <h2 className="course-subtitle">Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <p className="reviewer-name">{review.reviewer.name}</p>
            <p className="review-text">{review.text}</p>
            <p className="review-rating">Rating: {review.rating}</p>
          </div>
        ))}
      </div>
      <div className={"course-instructor-container"}>
        <img
          src={
            instructor.profilePicture
              ? `http://localhost:5000/${instructor.profilePicture}`
              : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
          }
          alt={"profile picture"}
          className={"course-instructor-picture"}
        />
        <p className="course-instructor">
          Created by:{" "}
          <Link to={`/profile/${instructor._id}`}>{instructor.name}</Link>
        </p>
        <p className="course-instructor-bio">{instructor.bio}</p>
      </div>
    </div>
  );
}
