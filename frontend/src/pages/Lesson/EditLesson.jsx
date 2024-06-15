import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import "react-quill/dist/quill.snow.css";
import Preloader from "../../components/Preloader/Preloader.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import ReactQuill from "react-quill";
import "./CreateEditLesson.css";

export default function EditLesson() {
  const { courseId, lessonId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [instructorId, setInstructorId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const userId = Cookies.get("id");

  useEffect(() => {
    if (!userId) {
      setRedirect(true);
      return;
    }
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/lessons/details/${lessonId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setLesson(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setContent(response.data.content);
        const courseResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/${courseId}`,
        );
        if (courseResponse.data.instructor._id !== Cookies.get("id"))
          setRedirect(true);
        setInstructorId(courseResponse.data.instructor);
        setCourse(courseResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLesson().finally(() => setLoading(false));
  }, [courseId, lessonId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/lessons/${lessonId}`,
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
    }
  };
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

  if (redirect && instructorId === Cookies.get("id"))
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  else if (redirect && instructorId !== Cookies.get("id")) navigate("/");
  return loading ? (
    <Preloader />
  ) : course && lesson ? (
    <form
      onSubmit={handleSubmit}
      className="create-lesson-container main-wrapper"
    >
      <Helmet>
        <title>Edit Lesson</title>
      </Helmet>
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
  ) : (
    <NotFound />
  );
}
