import { Link } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import FeedBackCard from "../../components/FeedBackCard/FeedBackCard.jsx";
import { useContext, useEffect } from "react";
import UserContext from "../../UserContext.jsx";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const { user } = useContext(UserContext);
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
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);
  return (
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
            <CourseCard
              course={{
                image:
                  "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/computer-coding.jpg",
                title: "Programming",
                quantity: "200+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://www.mtu.edu/cs/what/images/what-is-computer-science-banner1600.jpg",
                title: "Computer science",
                quantity: "100+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://imageio.forbes.com/specials-images/imageserve/5fca87f3ce4ca55e8985a10a/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
                title: "Business",
                quantity: "50+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://ecorner.stanford.edu/wp-content/uploads/sites/2/2016/08/eCorner_Arts_Tech5.jpg",
                title: "Arts",
                quantity: "50+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://t3.ftcdn.net/jpg/04/83/90/18/360_F_483901821_46VsNR67uJC3xIKQN4aaxR6GtAZhx9G8.jpg",
                title: "Math",
                quantity: "100+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://kaplan.co.uk/images/default-source/insights-posts/magnifying-glass-data.jpg?sfvrsn=215d7f02_1",
                title: "Data Analyst",
                quantity: "100+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://img.freepik.com/free-photo/texture-treble-clef-dark-background-isolated-generative-ai_169016-29581.jpg",
                title: "Music",
                quantity: "20+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://static.owayo-cdn.com/newhp/img/magazin/sportmotivation-EN/sport-motivation-670.jpg",
                title: "Sport",
                quantity: "10+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://elearningindustry.com/wp-content/uploads/2022/12/shutterstock_2037142181.jpg",
                title: "Cybersecurity",
                quantity: "50+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://uwaterloo.ca/science/sites/default/files/uploads/images/190424-uw-mur-dscf2586_resized.jpg",
                title: "Science",
                quantity: "100+ courses",
              }}
            />
            <CourseCard
              course={{
                image:
                  "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2F6d165ba4-2390-4263-a804-1e2d6a87d034.png?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1",
                title: "Economics",
                quantity: "50+ courses",
              }}
            />
          </div>
          <Link to={"/courses"}>
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
