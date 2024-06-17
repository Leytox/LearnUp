import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../../../UserContext.jsx";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (Cookies.get("token")) setRedirect(true);
  }, []);

  async function Login(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/login`,
        {
          email,
          password,
        },
      );
      if (response.status === 200) setRedirect(true);
      if (response.data.token)
        Cookies.set("token", response.data.token, {
          expires: 1,
          sameSite: "strict",
        });
      if (response.data.id)
        Cookies.set("id", response.data.id, { expires: 1, sameSite: "strict" });
      if (response.data.username) {
        Cookies.set("username", response.data.username, {
          expires: 1,
          sameSite: "strict",
        });
        setUser({ username: response.data.username });
      }
      if (response.data.role)
        Cookies.set("role", response.data.role, {
          expires: 1,
          sameSite: "strict",
        });
    } catch (err) {
      setError(err.response.data);
    }
  }

  if (redirect) navigate("/");
  return (
    <form onSubmit={Login} className={"main-wrapper"}>
      <Helmet>
        <title>{t("login")}</title>
      </Helmet>
      <h1>{t("welcomeBack")}</h1>
      <input
        type="email"
        id="email"
        name="email"
        placeholder={t("email")}
        required={true}
        onChange={(event) => {
          setEmail(event.target.value);
          setError(false);
        }}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder={t("password")}
        required={true}
        onChange={(event) => {
          setPassword(event.target.value);
          setError(false);
        }}
      />
      <button type={"submit"}>
        {t("continue")} <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <p>
        {t("dontHaveAccount")}{" "}
        <Link to={"/signup"} style={{ color: "#007bff" }}>
          {t("signUp")}
        </Link>
      </p>
      {error && error.errorType === "email" && (
        <p style={{ color: "red" }}>{error.msg}</p>
      )}
      {error && error.errorType === "password" && (
        <p style={{ color: "red" }}>
          {error.msg}
          <Link to={"/forgot-password"}>
            <br /> {t("forgotPassword")}
          </Link>
        </p>
      )}
      {error && error.errorType === "verification" && (
        <p style={{ color: "red" }}>
          {error.msg}
          <Link to={`/verify/${error.userId}`}>{t("verifyAccount")}</Link>
        </p>
      )}
    </form>
  );
}
