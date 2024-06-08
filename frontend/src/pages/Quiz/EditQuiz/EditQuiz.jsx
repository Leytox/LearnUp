import { useEffect, useState } from "react";
import axios from "axios";
import "../CreateEditQuiz.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";

export default function EditQuiz() {
  const { courseId, lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ text: "", isCorrect: false }] },
  ]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!Cookies.get("token") && Cookies.get("role") !== "instructor")
      navigate("/login");
    const fetchQuiz = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/course/${courseId}/quizz/${quizId}`,
        {
          headers: {
            "x-auth-token": Cookies.get("token"),
          },
        },
      );
      setTitle(response.data.title);
      setDescription(response.data.description);
      setQuestions(response.data.questions);
    };
    fetchQuiz().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/quizzes/course/${courseId}/quizz/${quizId}`,
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
      alert("Quiz edited successfully");
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

  return loading ? (
    <Preloader />
  ) : (
    <form onSubmit={handleSubmit} className="create-quizz-container">
      <h1 className="create-quizz-title">Edit Quiz</h1>
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
              Add Option
            </button>
            <button type="button" onClick={() => deleteQuestion(qIndex)}>
              Delete Question
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="add-question-button"
      >
        Add Question
      </button>
      <button type="submit" className="create-quizz-button">
        Edit Quiz
      </button>
    </form>
  );
}
