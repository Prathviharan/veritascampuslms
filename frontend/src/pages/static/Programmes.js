/* import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../css/ProgrammeSection1.css";
import programmesImage from "../../assets/programmes-image.png";
import { Link, useLocation } from "react-router-dom";

const Programmes = () => {
  const [diplomaOpen, setDiplomaOpen] = useState(false);
  const [degreeOpen, setDegreeOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const breadcrumbPath = pathParts.map((part, index) => (
    <span key={index}>
      <span className="breadcrumb-separator"> / </span>
      {decodeURIComponent(part.replace(/-/g, " "))}
    </span>
  ));

  return (
    <div className="programmes-page">
      <Navbar />

      <div className="breadcrumb-container text-center my-3">
        <Link to="/" className="breadcrumb-link">Home</Link>
        {breadcrumbPath}
      </div>

      <div className="programmes-content text-center">
        <img
          src={programmesImage}
          alt="Programmes Section"
          className="programme-image"
        />

        <div className="programme-buttons-container">
          <div className="dropdown">
            <button
              className={`dropdown-btn ${diplomaOpen ? "active" : ""}`}
              onClick={() => setDiplomaOpen(!diplomaOpen)}
            >
              Diploma Programmes {diplomaOpen ? "▲" : "▼"}
            </button>
            {diplomaOpen && (
              <div className="dropdown-content">
                <Link to="/programmes/diploma/overview">Overview</Link>
                <Link to="/programmes/diploma/arts">Arts and Humanities</Link>
                <button
                  className={`nested-dropdown-btn ${managementOpen ? "active" : ""}`}
                  onClick={() => setManagementOpen(!managementOpen)}
                >
                  Management and Business Studies {managementOpen ? "▲" : "▼"}
                </button>
                {managementOpen && (
                  <div className="nested-dropdown-content">
                    <Link to="/programmes/diploma/management/overview">Overview</Link>
                    <Link to="/programmes/diploma/management/hr">DIP. in HUMAN RESOURCE MANAGEMENT</Link>
                    <Link to="/programmes/diploma/management/ba">DIP. in BUSINESS ADMINISTRATION</Link>
                    <Link to="/programmes/diploma/management/sales">DIP. in INTERNAL & SALES MARKETING</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dropdown">
            <button
              className={`dropdown-btn ${degreeOpen ? "active" : ""}`}
              onClick={() => setDegreeOpen(!degreeOpen)}
            >
              Degree Programmes {degreeOpen ? "▲" : "▼"}
            </button>
            {degreeOpen}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Programmes; */
