import "./CategoryCard.css";

export default function CategoryCard({ category }) {
  return (
    <div className={"category-card"}>
      <img src={category.image} alt={category.title} />
      <div className={"category-card-text"}>
        <h3>{category.title}</h3>
      </div>
    </div>
  );
}
