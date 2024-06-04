import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../Search/Search.jsx";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import UserContext from "../../UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChalkboardUser,
  faHouse,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
          {!user && (
            <li>
              <Link to={"/login"}>Log In</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to={"/signup"} id={"signup-link"}>
                Join for Free
              </Link>
            </li>
          )}
          {Cookies.get("role") === "instructor" && (
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
          {Cookies.get("role") === "student" && (
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
          <li>
            <LanguageSelector />
          </li>
        </ul>
      </nav>
    </header>
  );
}