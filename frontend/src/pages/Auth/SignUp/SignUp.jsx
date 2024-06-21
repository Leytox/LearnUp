import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import "./SignUp.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("token")) setRedirect(true);
  }, []);

  async function Register(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/register`,
        {
          name,
          email,
          password,
          role,
          bio,
          phoneNumber,
        },
      );
      setUserId(response.data.id);
      if (response.status === 200) setRedirect(true);
    } catch (err) {
      setError(true);
    }
  }

  if (redirect) navigate(`/verify/${userId}`);

  return (
    <form className={"main-wrapper"} onSubmit={Register}>
      <Helmet>
        <title>{t("signUp")}</title>
      </Helmet>
      <h1>{t("createAccount")}</h1>
      <input
        type="text"
        id="name"
        name="name"
        placeholder={t("name")}
        required={true}
        minLength={3}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="email"
        id="email"
        name="email"
        placeholder={t("email")}
        required={true}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder={t("password")}
        required={true}
        minLength={6}
        onChange={(event) => setPassword(event.target.value)}
      />
      <PhoneInput
        maxLength={16}
        placeholder={t("enterPhoneNumber")}
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
      <select
        id="role"
        name="role"
        required={true}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value={"student"}>{t("student")}</option>
        <option value={"instructor"}>{t("instructor")}</option>
      </select>
      <textarea
        required={true}
        id="bio"
        name="bio"
        placeholder={t("tellSomething")}
        rows="3"
        cols="50"
        onChange={(event) => setBio(event.target.value)}
      />
      <button type={"submit"}>
        {t("continue")} <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <p>
        {t("alreadyHaveAccount")}{" "}
        <Link to={"/login"} style={{ color: "#007bff" }}>
          {t("login")}
        </Link>
      </p>
      {error && <p style={{ color: "red" }}>{t("userExists")}</p>}
    </form>
  );
}
