import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard/CategoryCard.jsx";
import FeedBackCard from "../../components/FeedBackCard/FeedBackCard.jsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../UserContext.jsx";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "../../components/Preloader/Preloader.jsx";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCircleInfo,
  faFlagCheckered,
  faPeopleGroup,
  faPersonChalkboard,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { faLeanpub } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories().finally(() => setLoading(false));
  }, []);
  return loading ? (
    <Preloader />
  ) : (
    <div className={"main-wrapper"}>
      <Helmet>
        <title>{t("home")}</title>
      </Helmet>
      <div
        style={{
          marginTop: "40px",
          marginBottom: "60px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className={"welcome-section"}>
          <div className={"texts"}>
            <h1>
              <FontAwesomeIcon icon={faLeanpub} /> {t("welcome")}
            </h1>
            <p>{t("introduction")}</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {!user && (
                <Link to={"/signup"}>
                  <button>
                    {t("getStarted")} <FontAwesomeIcon icon={faFlagCheckered} />
                  </button>
                </Link>
              )}
              <Link to={"/about"}>
                <button>
                  {t("learnMore")} <FontAwesomeIcon icon={faCircleInfo} />
                </button>
              </Link>
            </div>
          </div>
          <img
            src={
              "https://t3.ftcdn.net/jpg/02/65/18/30/360_F_265183061_NkulfPZgRxbNg3rvYSNGGwi0iD7qbmOp.jpg"
            }
            alt={"picture of man using laptop"}
            width={"500px"}
          />
        </div>

        <div className={"features"}>
          <div className={"texts"}>
            <h2>{t("weCollaborate")}</h2>
            <p>{t("weCollaborateText")}</p>
          </div>
        </div>

        <div className={"explore"}>
          <h1>
            {t("exploreCourses")} <FontAwesomeIcon icon={faPersonChalkboard} />
          </h1>
          <div className={"course-types"}>
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
          <Link to={"/courses?search="}>
            <button>
              {t("checkMore")} <FontAwesomeIcon icon={faTurnUp} />
            </button>
          </Link>
        </div>

        <div className={"community"}>
          <h1>
            {t("community")} <FontAwesomeIcon icon={faPeopleGroup} />
          </h1>
          <div className={"feedback"}>
            <FeedBackCard
              feedback={{
                image:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
                name: "John Doe",
                country: "United States",
                comment:
                  "LearnUp exceeded my expectations in every way! The course content was incredibly comprehensive and well-structured, making complex topics easy to understand. The interactive quizzes and hands-on projects were particularly engaging and helped solidify my knowledge.",
              }}
            />
            <FeedBackCard
              feedback={{
                image:
                  "https://miro.medium.com/v2/resize:fit:1400/1*y_uyQN1xEjppGVWJJkibMQ.jpeg",
                name: "Gabriela",
                country: "Nigeria",
                comment:
                  "The e-learning program had its pros and cons. On the plus side, the platform was easy to navigate, and the course material was accessible and well-organized. The discussion forums provided a good opportunity to interact with fellow learners. ",
              }}
            />
            <FeedBackCard
              feedback={{
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
                name: "Rafael",
                country: "Spain",
                comment:
                  "Overall, the e-learning program was a positive experience. The course material was detailed and covered all the necessary aspects of the subject. I appreciated the flexibility to learn at my own pace, which was perfect for balancing with my busy schedule. The video lectures were clear, and the supplemental resources were very helpful. ",
              }}
            />
          </div>
        </div>
        <div className={"contacts"}>
          <h1>{t("gotQuestions")}</h1>
          <Link to={"/help"}>
            <button>
              FAQ <FontAwesomeIcon icon={faAddressBook} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
