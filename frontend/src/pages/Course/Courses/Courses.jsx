import { useContext, useEffect, useState } from "react";
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
import { DeviceContext } from "../../../DeviceContext.jsx";
import { useTranslation } from "react-i18next";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]); // Adjust this range as needed
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest"); // "oldest" or "newest"
  const [categories, setCategories] = useState([]);
  const { isMobile } = useContext(DeviceContext);
  const [difficulty, setDifficulty] = useState(""); // Add this state
  const [isFilterVisible, setFilterVisible] = useState(!isMobile);
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
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/search?query=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}&sortOrder=${sortOrder}&difficulty=${difficulty}&page=${page}&limit=${limit}`,
        );
        setCourses(response.data.items);
        setTotalItems(response.data.totalItems);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses().finally(() => setLoading(false));
  }, [searchQuery, filterApplied, page]);

  function applyFilter() {
    setPriceRange(priceRange);
    setCategory(category);
    setDifficulty(difficulty);
    setSortOrder(sortOrder);
    setFilterApplied((prev) => !prev);
    setFilterVisible(false);
  }

  function resetFilter() {
    setPriceRange([0, 100]);
    setCategory("");
    setDifficulty("");
    setSortOrder("oldest");
    setFilterApplied((prev) => !prev);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
        );
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="courses-container main-wrapper">
      <Helmet>
        <title>{t("courses")}</title>
      </Helmet>
      <button
        className={"hide-filter"}
        onClick={() => setFilterVisible(!isFilterVisible)}
        title={t("filter")}
      >
        {isFilterVisible ? (
          <FontAwesomeIcon icon={faFilterCircleXmark} />
        ) : (
          <FontAwesomeIcon icon={faFilter} />
        )}
      </button>
      <div className={"courses-main-wrapper"}>
        {isFilterVisible && (
          <div className={"filter"}>
            <h1>{t("filter")}</h1>
            <label>
              {t("from")}: {priceRange[0]}$
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
            />{" "}
            <label>
              {t("to")}: {priceRange[1]}$
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
            />
            <label>{t("category")}:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t("allCategories")}</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <label>{t("sortOrder")}:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="oldest">{t("oldest")}</option>
              <option value="newest">{t("newest")}</option>
            </select>
            <label>{t("difficulty")}:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">{t("allDifficulties")}</option>
              <option value="Beginner">{t("beginner")}</option>
              <option value="Intermediate">{t("intermediate")}</option>
              <option value="Advanced">{t("advanced")}</option>
            </select>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={applyFilter}>
                {t("applyFilter")} <FontAwesomeIcon icon={faCheck} />
              </button>
              <button onClick={resetFilter}>
                {t("resetFilter")} <FontAwesomeIcon icon={faBroom} />
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <Preloader />
        ) : (
          <div className={"courses-list"}>
            {courses.length === 0 ? (
              <h1 className={"courses-not-found"}>{t("noCoursesFound")}</h1>
            ) : (
              courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
          </div>
        )}
      </div>
      {loading ? null : courses.length !== 0 && totalPages > 1 ? (
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
      ) : null}
    </div>
  );
}
