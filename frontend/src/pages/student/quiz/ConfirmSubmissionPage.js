import React, { useState } from "react";

const ConfirmSubmissionPage = () => {
  const navigate = useState();
  return (
    <div className="container">
      <div className="container d-flex justify-content-center">
        <h2 className="fw-bold fs-2" style={{ color: "#55B649" }}>
          Successfully submitted!
        </h2>
      </div>
      <div className="mt-3">
        <p>
          Your quiz has been successfully submitted. Thank you for completing
          it! Your responses have been recorded, and you will receive your
          results shortly if applicable. Please avoid refreshing or closing the
          page until confirmation is complete. We appreciate your participation
          and hope you found the quiz helpful for your learning. Good luck with
          your results!
        </p>
      </div>
      <div className="d-flex justify-content-left">
        <button
          className="btn btn-success fw-bold mb-5 mt-3"
          onClick={() => navigate("/")}
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
          Back to course
        </button>
      </div>
    </div>
  );
};

export default ConfirmSubmissionPage;
