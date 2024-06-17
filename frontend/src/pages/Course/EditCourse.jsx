import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { faBan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader.jsx";
import { Helmet } from "react-helmet";
import "./CreateEditCourse.css";
import NotFound from "../NotFound/NotFound.jsx";
import { useTranslation } from "react-i18next";

export default function CreateCourse() {
  const [course, setCourse] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [availability, setAvailability] = useState("false");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const userId = Cookies.get("id");
  const { t } = useTranslation();
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/${courseId}`,
        );
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/categories`,
        );
        setCourse(response.data);
        setAvailableCategories(categoriesResponse.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setPrice(response.data.price);
        setImage(response.data.picture);
        setDifficulty(response.data.difficulty);
        setAvailability(response.data.available.toString());
        if (
          response.data.instructor._id !== userId &&
          Cookies.get("role") !== "admin"
        )
          setRedirect(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse().finally(() => setLoading(false));
  }, [courseId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("difficulty", difficulty);
      formData.append("available", availability);
      if (file) formData.append("file", file[0]);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/courses/${courseId}`,
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
      if (err.response.status === 400) alert(err.response.data.msg);
      else alert("Error editing course");
    }
  };

  if (redirect && Cookies.get("role") === "instructor") navigate("/dashboard");
  else if (redirect) navigate("/courses?search=");

  return loading ? (
    <Preloader />
  ) : course ? (
    <form
      onSubmit={handleSubmit}
      className="create-course-container main-wrapper"
    >
      <Helmet>
        <title>{t("editCourse")}</title>
      </Helmet>
      <h1 className="create-course-title">{t("editCourse")}</h1>
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
        <label>{t("availability")}</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required={true}
        >
          <option value={"true"}>{t("shown")}</option>
          <option value={"false"}>{t("hidden")}</option>
        </select>
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
          required={true}
        >
          <option value="">{t("selectDifficulty")}</option>
          <option value={"Beginner"}>{t("beginner")}</option>
          <option value={"Intermediate"}>{t("intermediate")}</option>
          <option value={"Advanced"}>{t("advanced")}</option>
        </select>
      </div>
      <div className="course-item">
        <label>{t("image")}</label>
        <img
          className={"course-picture"}
          src={
            image
              ? `${import.meta.env.VITE_BACKEND_URI}/${image}`
              : "https://cdn-icons-png.flaticon.com/512/21/21104.png"
          }
          alt={"profile picture"}
          width={200}
        />
        <input
          required={false}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
      </div>
      <div className={"create-course-buttons"}>
        <button type="submit" className="create-course-button">
          {t("save")} <FontAwesomeIcon icon={faFloppyDisk} />
        </button>
        <Link to={Cookies.get("role") === "admin" ? "/admin" : "/dashboard"}>
          <button>
            {t("cancel")} <FontAwesomeIcon icon={faBan} />
          </button>
        </Link>
      </div>
    </form>
  ) : (
    <NotFound />
  );
}
