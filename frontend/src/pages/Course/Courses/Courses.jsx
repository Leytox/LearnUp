import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CourseCard from "../../../components/CourseCard/CourseCard.jsx";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import "./Courses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faBroom,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faFilter,
  faFilterCircleXmark,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]); // Adjust this range as needed
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest"); // "oldest" or "newest"
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState(""); // Add this state
  const [isFilterVisible, setFilterVisible] = useState(true);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [filterApplied, setFilterApplied] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 6;
  const pageLimit = 5;
  const startPage = Math.max(1, page - Math.floor(pageLimit / 2));
  const totalPages = Math.ceil(totalItems / limit);
  const endPage = Math.min(totalPages, startPage + pageLimit - 1);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/search?query=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}&sortOrder=${sortOrder}&difficulty=${difficulty}&page=${page}&limit=${limit}`,
        );
        setCourses(response.data.items);
        setTotalItems(response.data.totalItems);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses().finally(() => setLoading(false));
  }, [searchQuery, filterApplied, page]);

  // Calculate total pages

  function applyFilter() {
    setPriceRange(priceRange);
    setCategory(category);
    setDifficulty(difficulty);
    setSortOrder(sortOrder);
    setFilterApplied((prev) => !prev);
  }

  function resetFilter() {
    setPriceRange([0, 100]);
    setCategory("");
    setDifficulty("");
    setSortOrder("oldest");
    setFilterApplied((prev) => !prev);
  }

  //fetch categories
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

  return (
    <div className="courses-container">
      <Helmet>
        <title>Courses</title>
      </Helmet>
      <button
        className={"hide-filter"}
        onClick={() => setFilterVisible(!isFilterVisible)}
        title={"Toggle Filter"}
      >
        {isFilterVisible ? (
          <FontAwesomeIcon icon={faFilterCircleXmark} />
        ) : (
          <FontAwesomeIcon icon={faFilter} />
        )}
      </button>
      <h1 style={{ textAlign: "center" }}>Courses</h1>
      <div className={"main-wrapper"}>
        {isFilterVisible && (
          <div className={"filter"}>
            <h1>Filter</h1>
            <label>From: {priceRange[0]}$</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
            />{" "}
            <label>To: {priceRange[1]}$</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
            />
            <label>Category:</label>
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
            <label>Sort Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
            </select>
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={applyFilter}>
                Apply <FontAwesomeIcon icon={faCheck} />
              </button>
              <button onClick={resetFilter}>
                Reset <FontAwesomeIcon icon={faBroom} />
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <Preloader />
        ) : (
          <div className={"courses-list"}>
            {courses.length === 0 ? (
              <h1 className={"courses-not-found"}>No courses found...</h1>
            ) : (
              courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
          </div>
        )}
      </div>
      {loading ? null : (
        <div className="page-buttons">
          <button onClick={() => setPage(1)} disabled={page === 1}>
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          {[...Array(endPage - startPage + 1).keys()].map((i) => {
            const pageNumber = startPage + i;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                disabled={page === pageNumber}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={page === totalPages}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </button>
        </div>
      )}
    </div>
  );
}
