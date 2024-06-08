import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard/CategoryCard.jsx";
import FeedBackCard from "../../components/FeedBackCard/FeedBackCard.jsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../UserContext.jsx";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "../../components/Preloader/Preloader.jsx";

export default function Home() {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories",
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
    <>
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
            <h1>Learn without limits</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
              eius ipsam iure officia repudiandae. Minima quod quos rerum vitae
              voluptate! Excepturi hic iste laudantium libero quaerat sed sunt
              ut veniam!
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {!user && (
                <Link to={"/signup"}>
                  <button>Get Started</button>
                </Link>
              )}
              <Link to={"/about"}>
                <button>Learn More</button>
              </Link>
            </div>
          </div>
          <img
            src={
              "https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc"
            }
            alt={"picture of man using laptop"}
            width={"500px"}
          />
        </div>

        <div className={"features"}>
          <div className={"texts"}>
            <h2>
              We collaborate with{"  "}
              <Link to={"/about/partners"} style={{ color: "#007bff" }}>
                325+ leading universities and companies
              </Link>
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
          <h1>Explore our courses</h1>
          <div className={"course-types"}>
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
          <Link to={"/courses?search="}>
            <button>Check all courses</button>
          </Link>
        </div>

        <div className={"community"}>
          <h1>Community feedback</h1>
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
      </div>
    </>
  );
}
