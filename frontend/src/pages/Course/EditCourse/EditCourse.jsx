import { useEffect, useState } from "react";
import axios from "axios";
import "./EditCourse.css";
import Cookies from "js-cookie";
import { faBan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Navigate, useParams } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";

export default function CreateCourse() {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const userId = Cookies.get("id");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
        );
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/categories",
        );
        setAvailableCategories(categoriesResponse.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setPrice(response.data.price);
        setImage(response.data.picture);
        setDifficulty(response.data.difficulty);
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
      if (file) formData.append("file", file[0]);
      const response = await axios.put(
        `http://localhost:5000/api/courses/${courseId}`,
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
      alert("Error editing course");
    }
  };

  if (redirect) return <Navigate to="/dashboard" />;

  return loading ? (
    <Preloader />
  ) : (
    <form onSubmit={handleSubmit} className="edit-course-container">
      <h1 className="edit-course-title">Edit Course Info</h1>
      <div className="course-item">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required={true}
        />
      </div>
      <div className="course-item">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />
      </div>
      <div className="course-item">
        <label>Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required={true}
          min={1}
        />
      </div>
      <div className="course-item">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required={true}
        >
          <option value="">Select a category</option>
          {availableCategories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="course-item">
        <label>Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required={true}
        >
          <option value="">Select a difficulty</option>
          <option value={"Beginner"}>Beginner</option>
          <option value={"Intermediate"}>Intermediate</option>
          <option value={"Advanced"}>Advanced</option>
        </select>
      </div>
      <div className="course-item">
        <label>Image</label>
        <img
          className={"course-picture"}
          src={
            image
              ? `http://localhost:5000/${image}`
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
      <div style={{ display: "flex", gap: "25px" }}>
        <button type="submit" className="edit-course-button">
          Save <FontAwesomeIcon icon={faFloppyDisk} />
        </button>
        <Link to={"/dashboard"}>
          <button>
            Cancel <FontAwesomeIcon icon={faBan} />
          </button>
        </Link>
      </div>
    </form>
  );
}
