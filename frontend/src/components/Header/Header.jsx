import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../Search/Search.jsx";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faCartShopping,
  faChalkboardUser,
  faHouse,
  faRightFromBracket,
  faScrewdriverWrench,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faLeanpub } from "@fortawesome/free-brands-svg-icons";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher.jsx";
import "./Header.css";
import { DeviceContext } from "../../DeviceContext.jsx";
import logo from "./logo.svg";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const { isSearchVisible, isMobile } = useContext(DeviceContext);
  const { t } = useTranslation();
  useEffect(() => {
    const checkScroll = () => {
      setIsHidden(window.scrollY > 300);
    };

    window.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

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
    <header className={isHidden ? "hidden" : ""}>
      <nav className={"navbar"}>
        <div className={"navbar-logo"}>
          <Link to={"/courses?search="}>
            <img src={logo} alt={"logo"} className={"header-logo"} />
          </Link>
        </div>
        <Search />
        {!isSearchVisible || !isMobile ? (
          <ul className={"navbar-links"}>
            {!user && location !== "/login" && (
              <li>
                <Link to={"/login"}>
                  {!isMobile ? (
                    t("login")
                  ) : (
                    <button style={{ width: "50px", height: "50px" }}>
                      <FontAwesomeIcon icon={faArrowRightToBracket} />
                    </button>
                  )}
                </Link>
              </li>
            )}
            {!user && location !== "/signup" && (
              <li>
                <Link to={"/signup"}>
                  {!isMobile ? (
                    t("signup")
                  ) : (
                    <button style={{ width: "50px", height: "50px" }}>
                      <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                  )}
                </Link>
              </li>
            )}
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
            {Cookies.get("role") === "student" &&
              location !== "/my-courses" && (
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
              <li id={"logout"}>
                <button
                  onClick={logout}
                  style={{ height: "50px", width: "50px" }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </li>
            )}
            <li>
              <LanguageSelector />
            </li>
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
