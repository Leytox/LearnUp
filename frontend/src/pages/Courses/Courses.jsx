import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CourseCard from "../../components/CourseCard/CourseCard.jsx";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import "./Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]); // Adjust this range as needed
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest"); // "oldest" or "newest"
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [filterApplied, setFilterApplied] = useState(false); // Add this line

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/course?query=${}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}&sortOrder=${sortOrder}`,
        );
        console.log(response);
        setCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses().finally(() => {
      setLoading(false);
      setFilterApplied(false); // Reset the filterApplied state
    });
  }, [searchQuery, filterApplied]); // Add filterApplied to the dependency array

  function applyFilter() {
    setPriceRange(priceRange);
    setCategory(category);
    setSortOrder(sortOrder);
    setFilterApplied(true); // Set filterApplied to true when the button is clicked
  }

  // New useEffect hook to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories",
        );
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  console.log(courses);

  return loading ? (
    <Preloader />
  ) : (
    <div className="courses-container">
      <Helmet>
        <title>Courses</title>
      </Helmet>
      <h1 style={{ textAlign: "center" }}>Courses</h1>
      <div className={"main-wrapper"}>
        <div className={"filter"}>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
          />{" "}
          to
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="oldest">Oldest</option>
            <option value="newest">Newest</option>
          </select>
          <button onClick={applyFilter}>Apply Filter</button>
        </div>
        <div className={"courses-list"}>
          {courses.length === 0 ? (
            <h2 className={"courses-not-found"}>No courses found</h2>
          ) : (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
