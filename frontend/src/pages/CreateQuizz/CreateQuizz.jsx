import { useState } from "react";
import axios from "axios";
import "./CreateQuizz.css";

export default function CreateQuizz() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ text: "", isCorrect: false }] },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/quizzes", {
        course: courseId,
        title,
        questions,
      });
      alert("Quiz created successfully");
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

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="create-quizz-container">
      <h1 className="create-quizz-title">Create Quiz</h1>
      <div>
        <label>Course ID</label>
        <input
          type="text"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-item">
          <label>Question {qIndex + 1}</label>
          <input
            type="text"
            value={question.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
            required
          />
          {question.options.map((option, oIndex) => (
            <div key={oIndex}>
              <label>Option {oIndex + 1}</label>
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
          ))}
          <button
            type="button"
            onClick={() => addOption(qIndex)}
            className="add-option-button"
          >
            Add Option
          </button>
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
        Create Quiz
      </button>
    </form>
  );
}
