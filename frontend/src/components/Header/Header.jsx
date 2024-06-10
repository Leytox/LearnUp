import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../Search/Search.jsx";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import UserContext from "../../UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChalkboardUser,
  faHouse,
  faRightFromBracket,
  faScrewdriverWrench,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faLeanpub } from "@fortawesome/free-brands-svg-icons";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation().pathname;
  const navigate = useNavigate();

  function logout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("id");
    setUser(null);
    navigate("/");
  }

  useEffect(() => {
    if (Cookies.get("username")) setUser({ username: Cookies.get("username") });
  }, [setUser]);

  return (
    <header>
      <nav className={"navbar"}>
        <div>
          <Link to={"/"} style={{ fontSize: "2em" }}>
            LearnUp
          </Link>
        </div>
        <Search />
        <ul className={"navbar-links"}>
          {location !== "/" && (
            <li>
              <Link to={"/"}>
                <button
                  style={{ width: "50px", height: "50px" }}
                  title={"Go to home"}
                >
                  <FontAwesomeIcon icon={faHouse} />
                </button>
              </Link>
            </li>
          )}
          {!user && location !== "/login" && (
            <li>
              <Link to={"/login"}>Log In</Link>
            </li>
          )}
          {!user && location !== "/signup" && (
            <li>
              <Link to={"/signup"} id={"signup-link"}>
                Join for Free
              </Link>
            </li>
          )}
          {Cookies.get("role") === "instructor" &&
            location !== "/dashboard" && (
              <li>
                <Link to={"/dashboard"}>
                  <button
                    style={{ width: "50px", height: "50px" }}
                    title={"Go to dashboard"}
                  >
                    <FontAwesomeIcon icon={faChalkboardUser} />
                  </button>
                </Link>
              </li>
            )}
          {Cookies.get("role") === "admin" && location !== "/admin" && (
            <li>
              <Link to={"/admin"}>
                <button
                  style={{ width: "50px", height: "50px" }}
                  title={"Go to admin panel"}
                >
                  <FontAwesomeIcon icon={faScrewdriverWrench} />
                </button>
              </Link>
            </li>
          )}
          {Cookies.get("role") === "student" && location !== "/my-courses" && (
            <li>
              <Link to={"/my-courses"}>
                <button
                  style={{ width: "50px", height: "50px" }}
                  title={"Enrollments"}
                >
                  <FontAwesomeIcon icon={faLeanpub} />
                </button>
              </Link>
            </li>
          )}
          {Cookies.get("role") === "student" && location !== "/cart" && (
            <li>
              <Link to={"/cart"}>
                <button
                  style={{ width: "50px", height: "50px" }}
                  title={"Go to cart"}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
              </Link>
            </li>
          )}
          {user && location !== "/profile" && (
            <li>
              <Link to={"/profile"}>
                <button
                  style={{ width: "50px", height: "50px" }}
                  title={"Go to profile"}
                >
                  <FontAwesomeIcon icon={faUser} />
                </button>
              </Link>
            </li>
          )}
          {user && (
            <li>
              <button
                onClick={logout}
                style={{ height: "50px", width: "50px" }}
                title={"Logout"}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
