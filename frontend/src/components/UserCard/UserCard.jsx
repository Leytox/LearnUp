import "./UserCard.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardUser,
  faGraduationCap,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function UserCard({ user }) {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <Link to={`/profile/${user._id}`} style={{ color: "black" }}>
      <div className="user-card">
        <p>
          {t("email")}: {user.email}
        </p>
        <p>
          {t("role")}:{" "}
          {user.role === "student" ? (
            <span>
              {t("student")} <FontAwesomeIcon icon={faGraduationCap} />
            </span>
          ) : user.role === "instructor" ? (
            <span>
              {t("instructor")} <FontAwesomeIcon icon={faChalkboardUser} />
            </span>
          ) : (
            <span>
              {t("admin")} <FontAwesomeIcon icon={faUserTie} />
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
