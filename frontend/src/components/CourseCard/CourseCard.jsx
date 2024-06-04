import "./CourseCard.css";

export default function CourseCard({ course }) {
  return (
    <div className={"course-card"}>
      <img src={course.image} alt={course.title} />
      <div className={"course-card-text"}>
        <h3>{course.title}</h3>
        <p>{course.quantity}</p>
      </div>
    </div>
  );
}
