import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "./Contacts.css";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Contacts() {
  return (
    <div className={"contacts-wrapper main-wrapper"}>
      <h1>Contacts</h1>
      <div className={"contacts-info"}>
        <p>Connect with us on social media:</p>
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
          For more information, please contact us at{" "}
          <a href={"mailto:nfo@yourpage.com"}>info@yourpage.com</a>{" "}
          <FontAwesomeIcon icon={faEnvelope} /> or call us{" "}
          <a href={"tel:1234567890"}>(123) 456-7890</a>{" "}
          <FontAwesomeIcon icon={faPhone} />
        </p>
      </div>
    </div>
  );
}
