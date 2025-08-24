import React from "react";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="container d-flex justify-content-left">
        <h2 className="fw-bold fs-2" style={{ color: "#55B649" }}>
          Quiz
        </h2>
      </div>
      <div className="mt-3">
        <p>
          Before you begin the quiz, please make sure you are fully prepared.
          This quiz is time-limited and once you start, it cannot be paused or
          restarted. You are required to answer all questions carefully, and
          note that some may have multiple correct answers. Do not refresh or
          close the window while taking the quiz, as it may result in loss of
          progress. The use of mobile phones, books, or any external assistance
          is strictly prohibited unless otherwise allowed. Click "Start Quiz"
          only when you are ready to proceed. Good luck!
        </p>
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-success fw-bold mb-5 mt-3"
          onClick={() => navigate("/quiz/questions")}
          type="submit"
          style={{
            width: "150px",
            height: "30px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: "#95C436",
            color: "white",
            border: "1px solid #3E9355",
            borderRadius: "6px",
          }}
        >
          Attempt
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
