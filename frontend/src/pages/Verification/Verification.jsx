import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import VerificationInput from "react-verification-input";
import Preloader from "../../components/Preloader/Preloader.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import "./Verification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

export default function Verification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/profile/${id}`,
        );
        setUser(response.data);
      };
      fetchUser().finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    }
  }, [id, user]);

  async function verify(event) {
    event.preventDefault();
    try {
      console.log(verificationCode, id);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/verify`,
        {
          verificationCode,
          id,
        },
      );
      alert(response.data.msg);
      if (response.status === 200) navigate("/login");

      // navigate to home page after successful verification
    } catch (err) {
      setError(true);
    }
  }

  return loading ? (
    <Preloader />
  ) : user ? (
    <form onSubmit={verify} className={"verification-input main-wrapper"}>
      <h1>{t("verification")}</h1>
      <VerificationInput
        placeholder={""}
        length={4}
        validChars={"1234567890"}
        id="verificationCode"
        name="verificationCode"
        required={true}
        onChange={(event) => setVerificationCode(event)}
      />
      <button type={"submit"}>{t("verify")}</button>
      {error && <p style={{ color: "red" }}>{t("invalidVerificationCode")}</p>}
      <a
        href="https://t.me/LearnUpOfficialBot"
        target="_blank"
        rel="noreferrer"
      >
        <button className={"verification-button-link"} type={"button"}>
          {t("getCodeViaTelegram")} <FontAwesomeIcon icon={faTelegram} />
        </button>
      </a>
    </form>
  ) : user.isPhoneVerified ? (
    navigate("/")
  ) : (
    <NotFound />
  );
}
