import "./UserCard.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardUser,
  faGraduationCap,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export default function UserCard({ user }) {
  return (
    <Link to={`/profile/${user._id}`} style={{ color: "black" }}>
      <div className="user-card">
        <p>Email: {user.email}</p>
        <p>
          Role: {user.role}{" "}
          {user.role === "student" ? (
            <FontAwesomeIcon icon={faGraduationCap} />
          ) : user.role === "instructor" ? (
            <FontAwesomeIcon icon={faChalkboardUser} />
          ) : (
            <FontAwesomeIcon icon={faUserTie} />
          )}
        </p>
      </div>
    </Link>
  );
}
