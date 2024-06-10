import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader.jsx";
import Cookies from "js-cookie";
import "./PassQuiz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import NotFound from "../NotFound/NotFound.jsx";

export default function PassQuiz() {
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const userId = Cookies.get("id");

  useEffect(() => {
    if (!userId) {
      setRedirect(true);
      return;
    }
    const fetchData = async () => {
      try {
        const quizResponse = await axios.get(
          `http://localhost:5000/api/quizzes/course/${courseId}/quizz/${quizId}`,
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        setQuiz(quizResponse.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchData().then(() => setLoading(false));
  }, [courseId, quizId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allCorrect = quiz.questions.every((question, index) =>
      question.options.every((option) =>
        option.isCorrect
          ? answers[index]?.includes(option.text)
          : !answers[index]?.includes(option.text),
      ),
    );

    if (allCorrect) {
      try {
        await axios.post(
          "http://localhost:5000/api/enrollments/progress/complete-quiz",
          {
            userId,
            quizId: quiz._id,
            courseId: quiz.course,
          },
          {
            headers: {
              "x-auth-token": Cookies.get("token"),
            },
          },
        );
        alert("Quiz completed successfully!");
        navigate(`/courses/${courseId}`);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    } else {
      alert("Some answers are incorrect. Please try again.");
    }
  };

  const handleAnswerChange = (questionIndex, answer, isCheckbox) => {
    if (isCheckbox) {
      const currentAnswers = answers[questionIndex] || [];
      if (currentAnswers.includes(answer)) {
        setAnswers({
          ...answers,
          [questionIndex]: currentAnswers.filter((ans) => ans !== answer),
        });
      } else {
        setAnswers({
          ...answers,
          [questionIndex]: [...currentAnswers, answer],
        });
      }
    } else {
      setAnswers({ ...answers, [questionIndex]: [answer] });
    }
  };

  if (redirect) navigate("/");
  if (quiz && quiz.length === 0) navigate("/");
  return loading ? (
    <Preloader />
  ) : quiz ? (
    <div className={"quizContainer"}>
      <Helmet>
        <title>Quiz</title>
      </Helmet>
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => {
          const hasMultipleCorrectAnswers =
            question.options.filter((option) => option.isCorrect).length > 1;
          return (
            <div key={index} className={"questionCard"}>
              <h3>
                Question {index + 1}: {question.questionText}
              </h3>
              {question.options.map((option) => (
                <div key={option.text}>
                  <label>
                    <input
                      type={hasMultipleCorrectAnswers ? "checkbox" : "radio"}
                      name={`question-${index}`}
                      value={option.text}
                      onChange={() =>
                        handleAnswerChange(
                          index,
                          option.text,
                          hasMultipleCorrectAnswers,
                        )
                      }
                      checked={
                        hasMultipleCorrectAnswers
                          ? answers[index]?.includes(option.text) || false
                          : answers[index]?.[0] === option.text
                      }
                    />
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          );
        })}
        <button className={"quiz-submit-button"} type="submit">
          Submit <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  ) : (
    <NotFound />
  );
}
