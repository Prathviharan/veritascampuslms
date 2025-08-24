import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

const StudentLayout = () => (
  <>
    <StudentNavbar />
    <div className="student-content">
      <Outlet />
    </div>
  </>
);

export default StudentLayout;
