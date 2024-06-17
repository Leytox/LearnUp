import { Link } from "react-router-dom";
import "./Footer.css";
import {
  faAddressBook,
  faInfo,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>{t("allRightsReserved")}</p>
        <ul className="footer-links">
          <li>
            <Link to="/help">
              {t("help")} <FontAwesomeIcon icon={faInfo} />
            </Link>
          </li>
          <li>
            <Link to="/about">
              {t("aboutUs")} <FontAwesomeIcon icon={faUsers} />
            </Link>
          </li>
          <li>
            <Link to="/contact">
              {t("contactUs")} <FontAwesomeIcon icon={faAddressBook} />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
