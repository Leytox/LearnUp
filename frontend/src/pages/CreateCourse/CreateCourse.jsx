import { useState } from "react";
import axios from "axios";
import "./CreateCourse.css";
import Cookies from "js-cookie";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/courses",
        {
          title,
          description,
          price,
          instructor: Cookies.get("id"),
        },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      alert("Course created successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

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
      <button type="submit" className="create-course-button">
        Create Course <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
