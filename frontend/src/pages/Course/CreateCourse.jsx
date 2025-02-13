import { useEffect, useState } from "react";
import axios from "axios";
import "./CreateEditCourse.css";
import Cookies from "js-cookie";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function CreateCourse() {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
        );
        setAvailableCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("difficulty", difficulty);
      formData.append("file", file[0]);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/courses`,
        formData,
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      if (response.status === 200) setRedirect(true);
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  if (redirect) navigate("/dashboard");

  return loading ? (
    <Preloader />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="create-course-container main-wrapper"
    >
      <Helmet>
        <title>{t("createCourse")}</title>
      </Helmet>
      <h1 className="create-course-title">{t("createCourse")}</h1>
      <div className="course-item">
        <label>{t("title")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required={true}
        />
      </div>
      <div className="course-item">
        <label>{t("description")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />
      </div>
      <div className="course-item">
        <label>{t("price")} ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required={true}
          min={1}
        />
      </div>
      <div className="course-item">
        <label>{t("category")}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required={true}
        >
          <option value="">{t("selectCategory")}</option>
          {availableCategories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="course-item">
        <label>{t("difficulty")}</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value="">{t("selectDifficulty")}</option>
          <option value={"Beginner"}>{t("beginner")}</option>
          <option value={"Intermediate"}>{t("intermediate")}</option>
          <option value={"Advanced"}>{t("advanced")}</option>
        </select>
      </div>
      <div className="course-item">
        <label>{t("image")}</label>
        <input
          required={true}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
      </div>
      <button type="submit" className="create-course-button">
        {t("createCourseButton")} <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
