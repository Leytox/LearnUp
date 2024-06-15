import { useEffect, useState } from "react";
import axios from "axios";
import "../CreateEditQuiz.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Preloader from "../../../components/Preloader/Preloader.jsx";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateQuiz() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ text: "", isCorrect: false }] },
  ]);
  const userId = Cookies.get("id");

  useEffect(() => {
    if (!userId) {
      setRedirect(true);
      return;
    }
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/courses/${courseId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        if (courseResponse.data.instructor._id !== userId) setRedirect(true);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchData().finally(() => setLoading(false));
  }, [courseId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/quizzes`,
        {
          title,
          description,
          questions,
          course: courseId,
          lesson: lessonId,
        },
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      alert("Quiz created successfully");
      navigate(`/course/${courseId}/lesson/${lessonId}`);
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const deleteQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  if (redirect) navigate("/");

  return loading ? (
    <Preloader />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="create-quizz-container main-wrapper"
    >
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <h1 className="create-quizz-title">Create Quiz</h1>
      <div className={"question-item"}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className={"question-item"}>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-item">
          <div className={"question-text"}>
            <label>Question {qIndex + 1}</label>
            <input
              type="text"
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              required
            />
          </div>
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className={"question-option"}>
              <label>Option {oIndex + 1}</label>
              <div className={"question-option-input"}>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, "text", e.target.value)
                  }
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(
                        qIndex,
                        oIndex,
                        "isCorrect",
                        e.target.checked,
                      )
                    }
                  />
                  Correct
                </label>
              </div>
            </div>
          ))}
          <div className={"question-item-buttons"}>
            <button type="button" onClick={() => addOption(qIndex)}>
              Add Option <FontAwesomeIcon icon={faPlus} />
            </button>
            <button type="button" onClick={() => deleteQuestion(qIndex)}>
              Delete Question <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="add-question-button"
      >
        New Question <FontAwesomeIcon icon={faPlus} />
      </button>
      <button type="submit" className="create-quizz-button">
        Create Quiz <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
