import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course, children }) {
  // Define a function to return color based on difficulty
  const getBorderColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "green";
      case "Intermediate":
        return "orange";
      case "Advanced":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div
      key={course._id}
      className={styles["course-item-card"]}
      style={{ borderBottomColor: getBorderColor(course.difficulty) }} // Set border color based on difficulty
    >
      <Link
        to={`/courses/${course._id}`}
        className={styles["course-item-card-link"]}
      >
        <img
          src={
            course.picture
              ? `http://localhost:5000/${course.picture}`
              : "https://cdn.shopify.com/s/files/1/0070/5901/3716/files/coding_background.jpg?v=1688538955"
          }
          alt={course.title}
        />
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p>
          <i>
            <strong>{course.category}</strong>
          </i>
        </p>
        <p>${course.price}</p>
        <p>{course.visible}</p>
      </Link>
      <div className={styles["course-item-card-children"]}>{children}</div>
    </div>
  );
}
