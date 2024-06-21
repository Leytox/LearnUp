import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function ResetPassword() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  async function ResetPassword(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/reset-password/${token}`,
        {
          newPassword,
        },
      );
      if (response.status === 200) {
        setSuccess(t("passwordResetSuccessful"));
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(err.response.data);
    }
  }

  return (
    <form onSubmit={ResetPassword} className={"main-wrapper"}>
      <Helmet>
        <title>{t("resetPassword")}</title>
      </Helmet>
      <h1>{t("resetPassword")}</h1>
      <input
        type="password"
        id="password"
        name="password"
        placeholder={t("newPassword")}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder={t("confirmPassword")}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">
        {t("submit")} <FontAwesomeIcon icon={faArrowRight} />
      </button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
}
