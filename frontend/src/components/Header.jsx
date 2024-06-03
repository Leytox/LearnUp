import { Link, useLocation } from "react-router-dom";
import Search from "./Search.jsx";
import LanguageSelector from "./Language.jsx";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import UserContext from "../UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation().pathname;

  function logout() {
    Cookies.remove("token");
    Cookies.remove("username");
    setUser(null);
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
              <Link to={"/"}>Home</Link>
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
          {user && (
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
          <li>
            <LanguageSelector />
          </li>
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
