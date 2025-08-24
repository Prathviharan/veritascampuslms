import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map each route segment to readable text
  const breadcrumbMap = {
    home: "Home",
    instructor: "Instructor",
    dashboard: "Dashboard",
    modules: "Modules",
    addquiz: "Add Quiz",
    addassignment: "Add Assignment",
    updateassignment: "Update Assignment",
    quizlist: "Quiz List",
    performance: "Performance",
    lectures: "Lecture Materials",
    assignments: "Assignments",
    quizzes: "Quizzes",
    year: "Year",
    semester: "Semester",
    programme: "Programme",
    display: "Display",
  };

  // Generate proper link for each breadcrumb item
  const generateLink = (index) => {
    const parts = pathnames.slice(0, index + 1);

    // Special case: clicking 'instructor' goes to dashboard
    if (parts.length === 1 && parts[0] === "instructor") {
      return "/instructor/dashboard";
    }

    return "/" + parts.join("/");
  };

  return (
    <nav style={{ marginBottom: "1rem", fontSize: "14px" }}>
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const to = generateLink(index);
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbMap[value.toLowerCase()] || value;

        return (
          <span key={to}>
            {" / "}
            {isLast ? (
              <span style={{ fontWeight: "bold", color: "#444" }}>{label}</span>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
