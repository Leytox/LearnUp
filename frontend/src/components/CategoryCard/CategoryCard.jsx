import "./CategoryCard.css";

export default function CategoryCard({ category, children }) {
  return (
    <div className={"category-card"}>
      <img
        className={"category-card-image"}
        src={
          category.picture
            ? `http://localhost:5000/${category.picture}`
            : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
        }
        alt={"profile picture"}
      />
      <div className={"category-card-text"}>
        <h3>{category.name}</h3>
        {children}
      </div>
    </div>
  );
}
