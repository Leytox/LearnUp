import "./UserCard.css";
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <Link to={`/profile/${user._id}`} style={{ color: "black" }}>
      <div className="user-card">
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    </Link>
  );
}
