import { useEffect, useState } from "react";
import axios from "axios";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import { Link, useParams } from "react-router-dom";
import Accordion from "../../../components/Accordion/Accordion.jsx";
import {
  faCartShopping,
  faComment,
  faPaperPlane,
  faPersonChalkboard,
  faRightToBracket,
  faVialCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CourseDetail.css";
import Cookies from "js-cookie";
import ReactStars from "react-rating-stars-component/dist/react-stars.js";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Helmet } from "react-helmet";
import NotFound from "../../NotFound/NotFound.jsx";
import { useTranslation } from "react-i18next";

TimeAgo.addDefaultLocale(en);

export default function CourseDetail() {
  const timeAgo = new TimeAgo("en-US");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const { courseId } = useParams();
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (Cookies.get("id")) {
          const userResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/profile/${Cookies.get("id")}`,
          );
          setUser(userResponse.data);
        }
        const courseResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/${courseId}`,
        );
        setCourse(courseResponse.data);
        const lessonsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/lessons/${courseId}`,
        );
        setLessons(lessonsResponse.data);
        const quizzesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/quizzes/${courseId}`,
        );
        setQuizzes(quizzesResponse.data);
        const instructorResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/profile/${courseResponse.data.instructor._id}`,
        );
        setInstructor(instructorResponse.data);
        const reviews = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/reviews/${courseId}`,
        );
        setReviews(reviews.data);
        if (Cookies.get("token") && Cookies.get("role") === "student") {
          const enrolledResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/enrollments/enrolled/${courseId}`,
            {
              headers: {
                "x-auth-token": Cookies.get("token"),
              },
            },
          );
          setIsEnrolled(!!enrolledResponse.data);
          if (!enrolledResponse.data) return;
          const progressResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/enrollments/progress/user/${Cookies.get("id")}/course/${courseId}`,
            {
              headers: {
                "x-auth-token": Cookies.get("token"),
              },
            },
          );
          if (progressResponse.data) setProgress(progressResponse.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourse().finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (Cookies.get("role") === "instructor") return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/cart`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        const courseInCart = response.data.some(
          (cartItem) => cartItem.course._id === course._id,
        );
        setIsInCart(courseInCart);
      } catch (error) {
        console.error(error);
      }
    };

    if (Cookies.get("token") && Cookies.get("role") === "student") fetchCart();
  }, [course]);

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/cart/add`,
        { courseId: course._id },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      if (response.status === 200) setIsInCart(true);
      alert("Course added to cart!");
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/reviews/`,
        { courseId, rating, comment: reviewText },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setReviewText("");
      setRating(0);
      alert("Review submitted!");
      const reviewsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/reviews/${courseId}`,
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return loading ? (
    <Preloader />
  ) : course ? (
    <div className="course-container main-wrapper">
      <Helmet>
        <title>{t("courseDetails")}</title>
      </Helmet>
      <div className={"course-details"}>
        <h1 className="course-title">{course.title}</h1>
        {isEnrolled && <p>Your Progress: {progress}%</p>}
        <h2 className={"course-category"}>{course.category}</h2>
        <p className="course-description">{course.description}</p>
        <div className={"course-content"}>
          <h2>{t("courseContent")}:</h2>
          <h2 className="course-subtitle">
            {t("lessons")} <FontAwesomeIcon icon={faPersonChalkboard} />
          </h2>
          <div>
            {lessons.map((lesson, index) => (
              <Accordion key={index} title={lesson.title}>
                <p>{lesson.description}</p>
                {(user?._id === course.instructor._id || isEnrolled) && (
                  <Link to={`/course/${course._id}/lesson/${lesson._id}`}>
                    <button>{t("showLesson")}</button>
                  </Link>
                )}
              </Accordion>
            ))}
          </div>
          <h2 className="course-subtitle">
            {t("quizzes")} <FontAwesomeIcon icon={faVialCircleCheck} />
          </h2>
          {quizzes.map((quiz, index) => (
            <Accordion key={index} title={quiz.title}>
              <p>{quiz.description}</p>
            </Accordion>
          ))}
        </div>
        {!Cookies.get("token") ? (
          <Link to={"/login"}>
            <button>
              {" "}
              <FontAwesomeIcon icon={faRightToBracket} /> {t("logInToBuy")} ($
              {course.price})
            </button>
          </Link>
        ) : user._id === course.instructor._id ||
          isEnrolled ||
          Cookies.get("role") === "instructor" ||
          Cookies.get("role") === "admin" ? null : isInCart ? (
          <Link to={"/cart"}>
            <button id={"buy-button"}>
              {t("goToCart")} <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </Link>
        ) : (
          <button id={"buy-button"} onClick={addToCart}>
            <FontAwesomeIcon icon={faCartShopping} /> {t("addToCart")} ($
            {course.price})
          </button>
        )}
        <h2 className="review-header">
          {t("comments")} <FontAwesomeIcon icon={faComment} />
        </h2>
        {isEnrolled && (
          <div className={"review-creation"}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src={
                  user.profilePicture
                    ? `${import.meta.env.VITE_BACKEND_URI}/${user.profilePicture}`
                    : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                }
                alt={"profile picture"}
                className={"review-user-picture"}
              />
              <p>{user.name}</p>
            </div>
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={48}
              activeColor={"#ffd700"}
            />
            <textarea
              rows={1}
              required={true}
              placeholder={t("leaveAComment")}
              className={"review-textarea"}
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
            />
            <button onClick={submitReview} className={"review-button-submit"}>
              {t("submit")} <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        )}
        {reviews.length === 0 ? (
          <h3 className={"reviews-empty"}>{t("noReviewsYet")}</h3>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <img
                src={
                  review.user.profilePicture
                    ? `${import.meta.env.VITE_BACKEND_URI}/${review.user.profilePicture}`
                    : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                }
                alt={"profile picture"}
                className={"review-user-picture"}
              />
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <p className="reviewer-name">
                    <Link to={`/profile/${review.user._id}`}>
                      {review.user.name}
                    </Link>
                  </p>
                  <p className="review-date">
                    {timeAgo.format(new Date(review.createdAt))}
                  </p>
                </div>
                <p className="review-text">{review.comment}</p>
                <p className="review-rating">
                  {t("rating")}: {review.rating}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="course-instructor-container">
        <img
          src={
            instructor.profilePicture
              ? `${import.meta.env.VITE_BACKEND_URI}/${instructor.profilePicture}`
              : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
          }
          alt={"profile picture"}
          className={"course-instructor-picture"}
        />
        <p className="course-instructor">
          {t("createdBy")}:{" "}
          <Link to={`/profile/${instructor._id}`}>{instructor.name}</Link>
        </p>
        <p className="course-instructor-bio">{instructor.bio}</p>
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
