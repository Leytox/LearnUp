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
  faBuilding,
  faBuildingColumns,
  faCircleInfo,
  faFlagCheckered,
  faHandshake,
  faPeopleGroup,
  faPersonChalkboard,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import { faLeanpub } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
        <title>Home</title>
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
              <FontAwesomeIcon icon={faLeanpub} /> Learn without limits
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
              eius ipsam iure officia repudiandae. Minima quod quos rerum vitae
              voluptate! Excepturi hic iste laudantium libero quaerat sed sunt
              ut veniam!
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {!user && (
                <Link to={"/signup"}>
                  <button>
                    Get Started <FontAwesomeIcon icon={faFlagCheckered} />
                  </button>
                </Link>
              )}
              <Link to={"/about"}>
                <button>
                  Learn More <FontAwesomeIcon icon={faCircleInfo} />
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
            <h2>
              We collaborate <FontAwesomeIcon icon={faHandshake} /> with{"  "}
              325+ leading universities{" "}
              <FontAwesomeIcon icon={faBuildingColumns} /> and companies{" "}
              <FontAwesomeIcon icon={faBuilding} />
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
              eius ipsam iure officia repudiandae. Minima quod quos rerum vitae
              voluptate! Excepturi hic iste laudantium libero quaerat sed sunt
              ut veniam!
            </p>
          </div>
        </div>

        <div className={"explore"}>
          <h1>
            Explore courses <FontAwesomeIcon icon={faPersonChalkboard} />
          </h1>
          <div className={"course-types"}>
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
          <Link to={"/courses?search="}>
            <button>
              Check more <FontAwesomeIcon icon={faTurnUp} />
            </button>
          </Link>
        </div>

        <div className={"community"}>
          <h1>
            Community <FontAwesomeIcon icon={faPeopleGroup} />
          </h1>
          <div className={"feedback"}>
            <FeedBackCard
              feedback={{
                image:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
                name: "John Doe",
                country: "United States",
                comment:
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore eius ipsam iure officia repudiandae.",
              }}
            />
            <FeedBackCard
              feedback={{
                image:
                  "https://miro.medium.com/v2/resize:fit:1400/1*y_uyQN1xEjppGVWJJkibMQ.jpeg",
                name: "Gabriela",
                country: "Nigeria",
                comment:
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore eius ipsam iure officia repudiandae.",
              }}
            />
            <FeedBackCard
              feedback={{
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
                name: "Rafael",
                country: "Spain",
                comment:
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore eius ipsam iure officia repudiandae.",
              }}
            />
          </div>
        </div>
        <div className={"contacts"}>
          <h1>Got any questions left? Just see for FAQ!</h1>
          <Link to={"/contact"}>
            <button>
              Contacts <FontAwesomeIcon icon={faAddressBook} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
