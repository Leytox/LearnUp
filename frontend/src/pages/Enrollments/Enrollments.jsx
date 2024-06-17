import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import Preloader from "../../components/Preloader/Preloader.jsx";
import "./Enrollments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStamp } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Enrollments() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/enrollments/my-courses`,
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

  async function generateCertificate(courseId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/enrollments/progress/certificate/${Cookies.get("id")}/${courseId}`,
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      window.open(
        `${import.meta.env.VITE_BACKEND_URI}/uploads/users_certificates/${response.data}`,
        "_blank",
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerateCertificate(courseId) {
    await generateCertificate(courseId);
  }

  return loading ? (
    <Preloader />
  ) : (
    <div className={"enrollmentsContainer main-wrapper"}>
      <Helmet>
        <title>{t("enrollments")}</title>
      </Helmet>
      {enrolledCourses.length === 0 && (
        <div className={"no-enrollments"}>
          <h1>{t("noCoursesEnrolled")}</h1>
          <Link to={"/courses?search="}>
            <button>
              {t("buyCourses")}
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </Link>
        </div>
      )}
      <div className={"enrolled-courses-container"}>
        {enrolledCourses.map((enrolled) => (
          <CourseCard
            key={enrolled.course._id}
            course={enrolled.course}
            className={"courseCard"}
          >
            {enrolled.progress === 100 ? (
              <button
                onClick={() => handleGenerateCertificate(enrolled.course._id)}
              >
                {t("generateCertificate")}
                <FontAwesomeIcon icon={faStamp} />
              </button>
            ) : (
              <p>
                {" "}
                {t("progress")}: {enrolled.progress}%
              </p>
            )}
          </CourseCard>
        ))}
      </div>
    </div>
  );
}
