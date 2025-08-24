import React from "react";
import "./Program.css";

const programs = [
  {
    id: 1,
    title: "Diploma in Business Administration",
    description:
      "Learn core business concepts including management, marketing, and finance.",
  },
  {
    id: 2,
    title: "Diploma in Human Resource Management",
    description:
      "Master HR skills such as recruitment, training, and performance management.",
  },
  {
    id: 3,
    title: "Diploma in English",
    description:
      "Improve your English language skills for academic and professional use.",
  },
  {
    id: 4,
    title: "Diploma in Sales & Marketing",
    description:
      "Develop strategies for customer engagement and successful selling.",
  },
];

const ProgrammesList = () => {
  return (
    <div className="program-view">
      <h1 className="program-title"> Programs </h1>
      <div className="program-grid">
        {programs.map((program) => (
          <div className="program-card" key={program.id}>
            <div className="program-icon">📘</div>
            <h2 className="program-name">{program.title}</h2>
            <p className="program-desc">{program.description}</p>
            <button className="program-button">Access Program</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgrammesList;
