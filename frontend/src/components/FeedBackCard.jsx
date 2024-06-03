import "./FeedBack.css";

export default function FeedBackCard({ feedback }) {
  return (
    <div className={"feedback-card"}>
      <div className={"feedback-card-text"}>
        <img src={feedback.image} alt={feedback.name} />
        <h3>{feedback.name}</h3>
        <h4>{feedback.country}</h4>
        <p>&quot;{feedback.comment}&quot;</p>
      </div>
    </div>
  );
}
