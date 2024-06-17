import { Link } from "react-router-dom";
import "./NotFound.css";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Assuming you have a CSS file for styling

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="not-found-container main-wrapper">
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">{t("404Oops")}</p>
      <Link to="/" className="not-found-button">
        {t("goHome")} <FontAwesomeIcon icon={faHouse} />
      </Link>
    </div>
  );
}
