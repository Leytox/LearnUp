import { Link } from "react-router-dom";
import "./Footer.css";
import {
  faAddressBook,
  faInfo,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 LearnUp. All rights reserved.</p>
        <ul className="footer-links">
          <li>
            <Link to="/help">
              Help <FontAwesomeIcon icon={faInfo} />
            </Link>
          </li>
          <li>
            <Link to="/about">
              About us <FontAwesomeIcon icon={faUsers} />
            </Link>
          </li>
          <li>
            <Link to="/contact">
              Contact Us <FontAwesomeIcon icon={faAddressBook} />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
