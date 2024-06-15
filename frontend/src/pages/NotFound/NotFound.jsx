import { Link } from "react-router-dom";
import "./NotFound.css";
import { Helmet } from "react-helmet"; // Assuming you have a CSS file for styling

export default function NotFound() {
  return (
    <div className="not-found-container main-wrapper">
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Oops! Page not found.</p>
      <Link to="/" className="not-found-button">
        Go Home
      </Link>
    </div>
  );
}
