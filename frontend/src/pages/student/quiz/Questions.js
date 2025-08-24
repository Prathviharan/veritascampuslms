import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const moduleId = "6858160cf306555894fa56ad";
  const [availableToday, setAvailableToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizes, setQuizes] = useState([]);
  const [currectQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizes = async () => {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/module/${moduleId}`
      );
      console.log(res.data);

      const quizdata = res.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      const availableQuizes = quizdata.find((quiz) => {
        // Check if quiz status allows it to be taken
        if (quiz.status !== "Scheduled") {
          return false;
        }

        const [startDate, endDate] = quiz.availability.split(" to ");

        // Create Date objects and reset time to start of day
        const start = new Date(startDate);
        const end = new Date(endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); // Set end to end of day

        // Compare Date objects directly
        return today >= start && today <= end;
      });

      if (availableQuizes) {
        setAvailableToday(true);
        //console.log("Quiz Available:", availableQuizes);
        setQuizes(availableQuizes);
      } else {
        setAvailableToday(false);
      }
      setLoading(false);
    };
    fetchQuizes();
  }, []);

  const handleNext = () => {
    if (quizes && currectQuestionIndex < quizes.questions.length - 1) {
      setCurrentQuestionIndex((next) => next + 1);
    }
  };

  const handlePrev = () => {
    if (quizes && currectQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const confirmSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
    };

    try {
      await axios.post(
        `http://localhost:5000/api/quizAnswers/${quizes._id}`,
        payload
      );
      alert("Quiz submitted successfully!");
      navigate("/submitQuiz");
      setShowModal(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting the quiz.");
    }
  };

  if (loading) {
    return (
      <div className="p-md-5">
        <div className="card bg-light p-3">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-md-5">
      <div>
        {availableToday && quizes ? (
          <div>
            <h3>{quizes.title}</h3>
            {quizes.questions.length > 0 && (
              <div className="card bg-light p-3">
                <div className="mb-3">
                  <h5>{quizes.questions[currectQuestionIndex].questionText}</h5>
                </div>

                {quizes.questions[currectQuestionIndex].options &&
                  Object.entries(
                    quizes.questions[currectQuestionIndex].options
                  ).map(([key, value]) => (
                    <div key={key} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${currectQuestionIndex}`}
                        id={`option-${key}`}
                        value={key}
                        checked={
                          answers[
                            quizes.questions[currectQuestionIndex]._id
                          ] === key
                        }
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [quizes.questions[currectQuestionIndex]._id]: key,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option-${key}`}
                      >
                        {key}: {value}
                      </label>
                    </div>
                  ))}

                <div>
                  {currectQuestionIndex > 0 && (
                    <button
                      className="btn btn-success"
                      onClick={handlePrev}
                      disabled={currectQuestionIndex === 0}
                    >
                      previous
                    </button>
                  )}

                  {currectQuestionIndex < quizes.questions.length - 1 ? (
                    <button
                      className="btn btn-success"
                      onClick={handleNext}
                      disabled={
                        currectQuestionIndex === quizes.questions.length - 1
                      }
                    >
                      next
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => setShowModal(true)}
                    >
                      finish
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>not available</div>
        )}
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay background
            backdropFilter: "blur(5px)", // Add blur effect to background
            zIndex: 1050, // Ensure modal is above all other content
          }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Submission</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to submit the quiz?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
