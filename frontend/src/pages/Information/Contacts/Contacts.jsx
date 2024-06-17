import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "./Contacts.css";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export default function Contacts() {
  const { t } = useTranslation();
  return (
    <div className={"contacts-wrapper main-wrapper"}>
      <Helmet>
        <title>{t("contacts")}</title>
      </Helmet>
      <h1>{t("contacts")}</h1>
      <div className={"contacts-info"}>
        <p>{t("connectWithUs")}</p>
        <div className={"contacts-info-social"}>
          <a
            href="https://www.facebook.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a
            href="https://www.twitter.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a
            href="https://www.instagram.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
            href="https://www.linkedin.com/in/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        </div>
        <p className={"contact-list"}>
          {t("moreInformation")}{" "}
          <a href={"mailto:nfo@yourpage.com"}>info@yourpage.com</a>{" "}
          <FontAwesomeIcon icon={faEnvelope} /> {t("orCallUs")}{" "}
          <a href={"tel:1234567890"}>(123) 456-7890</a>{" "}
          <FontAwesomeIcon icon={faPhone} />
        </p>
      </div>
    </div>
  );
}
