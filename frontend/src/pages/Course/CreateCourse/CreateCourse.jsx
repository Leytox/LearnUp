import { useEffect, useState } from "react";
import axios from "axios";
import "./CreateCourse.css";
import Cookies from "js-cookie";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate } from "react-router-dom";

export default function CreateCourse() {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories",
        );
        setAvailableCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
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
        "http://localhost:5000/api/courses",
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

  if (redirect) return <Navigate to={"/dashboard"} />;

  return (
    <form onSubmit={handleSubmit} className="create-course-container">
      <h1 className="create-course-title">Create Course</h1>
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
        <input
          required={true}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
      </div>
      <button type="submit" className="create-course-button">
        Create Course <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
