import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import "./EditLesson.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";
import Preloader from "../../../components/Preloader/Preloader.jsx";

export default function EditLesson() {
  const { courseId, lessonId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
        );
        if (response.data.instructor._id !== Cookies.get("id"))
          setRedirect(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse().then(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lessons/details/${lessonId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
        setContent(response.data.content);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLesson().finally(() => setLoading(false));
  }, [lessonId]);

  if (redirect) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          course: courseId,
          title,
          description,
          content,
        },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setRedirect(true);
    } catch (err) {
      console.error(err);
      alert("Error creating lesson");
    }
  };

  if (redirect)
    return <Navigate to={`/course/${courseId}/lesson/${lessonId}`} />;

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block", "image", "link", "video"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }][{ align: [] }],

    ["clean"], // remove formatting button
  ];

  return loading ? (
    <Preloader />
  ) : (
    <form onSubmit={handleSubmit} className="create-lesson-container">
      <h1 className="create-lesson-title">Edit Lesson</h1>
      <div className="lesson-item">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="lesson-item">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="lesson-item">
        <label>Content</label>
        <ReactQuill
          modules={{ toolbar: toolbarOptions }}
          theme={"snow"}
          className={"quill-editor"}
          value={content}
          onChange={(e) => setContent(e)}
          style={{ width: "100%" }}
        />
      </div>
      <button type="submit" className="create-lesson-button">
        Edit Lesson
      </button>
    </form>
  );
}
