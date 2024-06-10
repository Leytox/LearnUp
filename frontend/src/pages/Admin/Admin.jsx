import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader.jsx";
import CategoryCard from "../../components/CategoryCard/CategoryCard.jsx";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import "./Admin.css";
import UserCard from "../../components/UserCard/UserCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("categories");
  const [isAdminPanelVisible, setAdminPanelVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/categories",
        );
        setCategories(categoriesResponse.data);
        const coursesResponse = await axios.get(
          "http://localhost:5000/api/courses/search?limit=10",
        );
        setCourses(coursesResponse.data.items);
        const usersResponse = await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setUsers(usersResponse.data); // Add this line
      } catch (error) {
        console.error(error);
      }
    };

    const role = Cookies.get("role");
    if (!role || role !== "admin") navigate("/login");
    else fetchData().finally(() => setLoading(false));
    setLoading(false);
  }, [navigate]);

  return loading ? (
    <Preloader />
  ) : (
    <div className={"admin-panel"}>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className={"admin-panel-header"}>
        <h1>Admin Dashboard</h1>
      </div>
      <button
        className={"hide-filter"}
        onClick={() => setAdminPanelVisible((prev) => !prev)}
        title={"Toggle Filter"}
      >
        {isAdminPanelVisible ? (
          <FontAwesomeIcon icon={faMinus} />
        ) : (
          <FontAwesomeIcon icon={faPlus} />
        )}
      </button>
      <div className={"admin-panel-container"}>
        {isAdminPanelVisible && (
          <div className={"admin-panel-control"}>
            <h1>Control</h1>
            <div className={"admin-panel-control-buttons"}>
              <button
                onClick={() => setTab("categories")}
                style={{
                  backgroundColor: tab === "categories" ? "white" : "#444",
                  color: tab === "categories" ? "#444" : "white",
                  border: "1px solid #444",
                }}
                disabled={tab === "categories"}
              >
                Categories
              </button>
              <button
                onClick={() => setTab("courses")}
                style={{
                  backgroundColor: tab === "courses" ? "white" : "#444",
                  color: tab === "courses" ? "#444" : "white",
                  border: "1px solid #444",
                }}
                disabled={tab === "courses"}
              >
                Courses
              </button>
              <button
                onClick={() => setTab("users")}
                style={{
                  backgroundColor: tab === "users" ? "white" : "#444",
                  color: tab === "users" ? "#444" : "white",
                  border: "1px solid #444",
                }}
                disabled={tab === "users"}
              >
                Users
              </button>
            </div>
          </div>
        )}
        {tab === "categories" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "50px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div className={"admin-panel-details-item"}>
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category}>
                  <Link to={`/admin/categories/${category._id}/edit`}>
                    <button>
                      Edit <FontAwesomeIcon icon={faPen} />
                    </button>
                  </Link>
                </CategoryCard>
              ))}
            </div>
            <Link to={"/admin/categories/create"}>
              <button>
                Create new <FontAwesomeIcon icon={faPlus} />
              </button>
            </Link>
          </div>
        )}
        {tab === "courses" && (
          <div className={"admin-panel-details-item"}>
            {courses.map((course) => (
              <div key={course._id}>
                <CourseCard course={course}>
                  <Link to={`/course/${course._id}/edit`}>
                    <button>
                      Edit <FontAwesomeIcon icon={faPen} />
                    </button>
                  </Link>
                </CourseCard>
              </div>
            ))}
          </div>
        )}
        {tab === "users" && (
          <div className={"admin-panel-details-item"}>
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
